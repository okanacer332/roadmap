// src/screens/RoadmapDetailScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Svg, { Rect, Text as SvgText, Path, G } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// Comment ve RoadmapNode arayüzlerini doğrudan dummyData.ts'den import ediyoruz
import { ROADMAPS, RoadmapNode, Comment } from '../data/dummyData';
import { colors } from '../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'RoadmapDetail'>;

const BOX_WIDTH = 150;
const BOX_HEIGHT = 50;
const HORIZONTAL_GAP = 50;
const VERTICAL_GAP = 70;
const PADDING = 20;

interface DrawableNode extends RoadmapNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DrawableLine {
  id: string;
  path: string;
}

// DUMMY_COMMENTS için de dummyData.ts'deki Comment arayüzünü kullanıyoruz.
// Bu yüzden DUMMY_COMMENTS'in yapısı da dummyData.ts'deki Comment arayüzüne uymalı.
// Not: dummyData.ts'deki Comment arayüzü 'author' yerine 'username' kullanıyor.
const DUMMY_COMMENTS: Comment[] = [
  { id: '1', userId: 'u99', username: 'Misafir Kullanıcı 1', text: 'Bu yol haritası çok ilham verici!', timestamp: '2025-07-29T18:00:00Z' },
  { id: '2', userId: 'u98', username: 'Misafir Kullanıcı 2', text: 'Harika bir bakış açısı sunmuş.', timestamp: '2025-07-29T18:05:00Z' },
];

const RoadmapDetailScreen = ({ route }: Props) => {
  const { roadmapId } = route.params;
  const selectedRoadmap = ROADMAPS.find(roadmap => roadmap.id === roadmapId);

  // selectedRoadmap bulunamazsa erken çıkış yapıyoruz
  if (!selectedRoadmap) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Roadmap bulunamadı.</Text>
      </View>
    );
  }

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [newCommentText, setNewCommentText] = useState<string>('');
  // Mevcut yorumları dummyData'dan alınan yorumlar ve eklediğimiz dummy yorumlarla birleştiriyoruz.
  const [comments, setComments] = useState<Comment[]>([...selectedRoadmap.comments, ...DUMMY_COMMENTS]);


  const toggleNode = (nodeId: string) => {
    const newSet = new Set(expandedNodes);
    if (newSet.has(nodeId)) {
      newSet.delete(nodeId);
    } else {
      newSet.add(nodeId);
    }
    setExpandedNodes(newSet);
  };

  const handleAddComment = () => {
    if (newCommentText.trim() === '') {
      return; // Boş yorum eklemeyi engelle
    }
    const newComment: Comment = {
      id: String(comments.length + 1), // Basit bir ID ataması
      userId: 'uAnonim', // Geçici kullanıcı ID'si
      username: 'Anonim Kullanıcı', // DummyData'daki Comment arayüzüne uygun olarak 'username' kullanıldı
      text: newCommentText.trim(),
      timestamp: new Date().toISOString(), // Güncel zaman damgası
    };
    setComments(prevComments => [...prevComments, newComment]);
    setNewCommentText('');
  };

  const { drawableNodes, drawableLines, canvasSize } = useMemo(() => {
    const nodesToDraw: DrawableNode[] = [];
    const linesToDraw: DrawableLine[] = [];
    let canvasBounds = { minX: Infinity, maxX: -Infinity, maxY: 0 };
    const baseCanvasWidth = Dimensions.get('window').width;

    function layout(node: RoadmapNode, x: number, y: number, parentNode?: DrawableNode, level = 0) {
      const isExpanded = expandedNodes.has(node.id);
      
      const nodeX = x;
      nodesToDraw.push({ ...node, x: nodeX, y, width: BOX_WIDTH, height: BOX_HEIGHT });
      
      canvasBounds.minX = Math.min(canvasBounds.minX, nodeX);
      canvasBounds.maxX = Math.max(canvasBounds.maxX, nodeX + BOX_WIDTH);
      canvasBounds.maxY = Math.max(canvasBounds.maxY, y + BOX_HEIGHT);

      if (parentNode) {
        const startX = parentNode.x + BOX_WIDTH / 2;
        const startY = parentNode.y + parentNode.height;
        const endX = nodeX + BOX_WIDTH / 2;
        const endY = y;
        const path = `M ${startX},${startY} C ${startX},${startY + VERTICAL_GAP / 2} ${endX},${endY - VERTICAL_GAP / 2} ${endX},${endY}`;
        linesToDraw.push({ id: `line-${parentNode.id}-${node.id}`, path });
      }

      let currentY = y + BOX_HEIGHT + VERTICAL_GAP;
      
      if (isExpanded && node.children) {
        // ZIGZAG LOGIC
        const direction = level % 2 === 0 ? 1 : -1; // 1 for right, -1 for left
        const childX_offset = HORIZONTAL_GAP * direction;

        node.children.forEach(child => {
          const childY = layout(child, x + childX_offset, currentY, nodesToDraw[nodesToDraw.length - 1], level + 1);
          currentY = childY;
        });
      }
      return currentY;
    }

    // Start in the middle of the screen
    layout(selectedRoadmap.nodes[0], baseCanvasWidth / 2 - BOX_WIDTH / 2, PADDING);

    // Adjust all coordinates so the leftmost element is at PADDING
    const shiftX = PADDING - canvasBounds.minX;
    const finalNodes = nodesToDraw.map(n => ({ ...n, x: n.x + shiftX }));
    const finalLines = linesToDraw.map(l => {
      const points = l.path.split(/[ M,C]/).filter(p => p !== '');
      
      let newPath = `M ${parseFloat(points[0]) + shiftX},${parseFloat(points[1])}`;
      for (let i = 2; i < points.length; i += 6) {
          newPath += ` C ${parseFloat(points[i]) + shiftX},${parseFloat(points[i+1])} ${parseFloat(points[i+2]) + shiftX},${parseFloat(points[i+3])} ${parseFloat(points[i+4]) + shiftX},${parseFloat(points[i+5])}`;
      }
      return { ...l, path: newPath };
    });

    return {
      drawableNodes: finalNodes,
      drawableLines: finalLines,
      canvasSize: { width: canvasBounds.maxX - canvasBounds.minX + PADDING * 2, height: canvasBounds.maxY + PADDING },
    };
  }, [selectedRoadmap, expandedNodes]);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Roadmap Detayları */}
      <View style={styles.detailHeader}>
        <Text style={styles.roadmapTitle}>{selectedRoadmap.title}</Text>
        <Text style={styles.roadmapDescription}>{selectedRoadmap.description}</Text>
        {/* Hata düzeltildi: selectedRoadmap.author bir objedir, username özelliğine erişiyoruz */}
        <Text style={styles.roadmapAuthor}>Oluşturan: {selectedRoadmap.author.username}</Text> 
      </View>

      {/* Svg tabanlı roadmap görselleştirmesi */}
      <ScrollView horizontal contentContainerStyle={styles.svgScrollView}>
        <Svg height={canvasSize.height} width={canvasSize.width}>
          {drawableLines.map(line => (
            <Path key={line.id} d={line.path} stroke={colors.primary} strokeWidth="2" fill="none" />
          ))}
          {drawableNodes.map(node => {
            const isExpanded = expandedNodes.has(node.id);
            const canExpand = node.children && node.children.length > 0;
            return (
              <G key={node.id} onPress={() => canExpand && toggleNode(node.id)}>
                <Rect x={node.x} y={node.y} width={node.width} height={node.height} fill={colors.cardBackground} stroke={isExpanded ? colors.primary : colors.border} strokeWidth="2" rx={10} />
                <SvgText x={node.x + node.width / 2} y={node.y + node.height / 2 + 5} fill={colors.text} fontSize="14" fontWeight="bold" textAnchor="middle">
                  {node.title}
                </SvgText>
                {canExpand && (
                  <SvgText x={node.x + node.width - 20} y={node.y + node.height - 15} fill={colors.textSecondary} fontSize="20">
                    {isExpanded ? '−' : '+'}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      {/* Yorumlar Bölümü */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Yorumlar</Text>

        {/* Yorum Giriş Alanı */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Bir yorum yaz..."
            placeholderTextColor={colors.textSecondary}
            multiline
            value={newCommentText}
            onChangeText={setNewCommentText}
          />
          <TouchableOpacity style={styles.commentSendButton} onPress={handleAddComment}>
            <Text style={styles.commentSendButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>

        {/* Yorum Listesi */}
        {comments.length === 0 ? (
          <Text style={styles.commentText}>Henüz yorum yok.</Text>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                {/* Hata düzeltildi: 'author' yerine 'username' kullanıldı */}
                <Text style={styles.commentAuthor}>{item.username}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              </View>
            )}
            // Performans için gerekli olabilecek prop'lar (büyük listelerde)
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: PADDING,
  },
  errorText: {
    color: colors.error, // colors.error artık globalStyles'da tanımlı olmalı
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  detailHeader: {
    marginBottom: PADDING,
  },
  roadmapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  roadmapDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  roadmapAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  svgScrollView: {
    alignItems: 'center', // SVG'nin yatayda ortalanması için
    paddingBottom: PADDING, // Alt kısımda boşluk bırakır
  },
  commentsSection: {
    marginTop: PADDING,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: PADDING,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentTextInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100, // Yorum alanının çok büyümesini engeller
    paddingHorizontal: 5,
  },
  commentSendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  commentSendButtonText: {
    color: colors.white, // colors.white artık globalStyles'da tanımlı olmalı
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentItem: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },
  commentText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  commentTimestamp: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'right',
  },
});

export default RoadmapDetailScreen;