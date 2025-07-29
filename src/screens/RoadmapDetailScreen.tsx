// src/screens/RoadmapDetailScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Text, TextInput, TouchableOpacity, FlatList, LayoutAnimation, UIManager, Platform } from 'react-native';
import Svg, { Rect, Text as SvgText, Path, G } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ROADMAPS, RoadmapNode, Comment } from '../data/dummyData';
import { colors } from '../theme/globalStyles';


type Props = NativeStackScreenProps<RootStackParamList, 'RoadmapDetail'>;


// Android'de LayoutAnimation'ı etkinleştir
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Nod boyutları ve boşluklar ayarlandı
const BOX_WIDTH = 200;
const BOX_HEIGHT = 60;
const HORIZONTAL_GAP = 70;
const VERTICAL_GAP = 60;
const PADDING = 20;

interface DrawableNode extends RoadmapNode {
  x: number;
  y: number;
  width: number;
  height: number;
  level: number; // Node'un seviyesini takip etmek için eklendi
}

interface DrawableLine {
  id: string;
  path: string;
}

// DUMMY_COMMENTS için dummyData.ts'deki Comment arayüzünü kullanıyoruz.
const DUMMY_COMMENTS: Comment[] = [
  { id: 'c99', userId: 'u99', username: 'Misafir Kullanıcı 1', text: 'Bu yol haritası çok ilham verici!', timestamp: '2025-07-29T18:00:00Z' },
  { id: 'c98', userId: 'u98', username: 'Misafir Kullanıcı 2', text: 'Harika bir bakış açısı sunmuş.', timestamp: '2025-07-29T18:05:00Z' },
];

const RoadmapDetailScreen = ({ route }: Props) => {
  const { roadmapId } = route.params;
  const selectedRoadmap = ROADMAPS.find(roadmap => roadmap.id === roadmapId);

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
  const [comments, setComments] = useState<Comment[]>([...selectedRoadmap.comments, ...DUMMY_COMMENTS]);
  const [showCommentsSection, setShowCommentsSection] = useState(false);

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
      return;
    }
    const newComment: Comment = {
      id: String(comments.length + 1),
      userId: 'uAnonim',
      username: 'Anonim Kullanıcı',
      text: newCommentText.trim(),
      timestamp: new Date().toISOString(),
    };
    setComments(prevComments => [...prevComments, newComment]);
    setNewCommentText('');
  };

  const toggleCommentsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCommentsSection(prevState => !prevState);
  };

  const { drawableNodes, drawableLines, canvasSize } = useMemo(() => {
    const nodesToDraw: DrawableNode[] = [];
    const linesToDraw: DrawableLine[] = [];
    let canvasBounds = { minX: Infinity, maxX: -Infinity, maxY: 0 };
    const baseCanvasWidth = Dimensions.get('window').width;

    function layout(node: RoadmapNode, x: number, y: number, parentNode?: DrawableNode, level = 0) {
      const nodeWidth = BOX_WIDTH;
      const nodeHeight = BOX_HEIGHT;
      const isExpanded = expandedNodes.has(node.id);
      
      const nodeX = x;
      nodesToDraw.push({ ...node, x: nodeX, y, width: nodeWidth, height: nodeHeight, level: level }); // level eklendi
      
      canvasBounds.minX = Math.min(canvasBounds.minX, nodeX);
      canvasBounds.maxX = Math.max(canvasBounds.maxX, nodeX + nodeWidth);
      canvasBounds.maxY = Math.max(canvasBounds.maxY, y + nodeHeight);

      if (parentNode) {
        const startX = parentNode.x + parentNode.width / 2;
        const startY = parentNode.y + parentNode.height;
        const endX = nodeX + nodeWidth / 2;
        const endY = y;
        const path = `M ${startX},${startY} C ${startX},${startY + VERTICAL_GAP / 2} ${endX},${endY - VERTICAL_GAP / 2} ${endX},${endY}`;
        linesToDraw.push({ id: `line-${parentNode.id}-${node.id}`, path });
      }

      let currentY = y + nodeHeight + VERTICAL_GAP;
      
      if (isExpanded && node.children) {
        const direction = level % 2 === 0 ? 1 : -1;
        const childX_offset = HORIZONTAL_GAP * direction;

        node.children.forEach(child => {
          const childY = layout(child, x + childX_offset, currentY, nodesToDraw[nodesToDraw.length - 1], level + 1);
          currentY = childY;
        });
      }
      return currentY;
    }

    layout(selectedRoadmap.nodes[0], baseCanvasWidth / 2 - BOX_WIDTH / 2, PADDING);

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

  // Node seviyesine göre font boyutunu belirleyen yardımcı fonksiyon
  const getNodeFontSize = (level: number) => {
    if (level === 0) return 16; // Ana düğüm
    if (level === 1) return 14; // Birinci seviye alt düğüm
    if (level === 2) return 12; // İkinci seviye alt düğüm
    return 10; // Daha derin seviyeler
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Roadmap Detayları */}
      <View style={styles.detailHeader}>
        <Text style={styles.roadmapTitle}>{selectedRoadmap.title}</Text>
        <Text style={styles.roadmapDescription}>{selectedRoadmap.description}</Text>
        <Text style={styles.roadmapAuthor}>Oluşturan: {selectedRoadmap.author.username}</Text> 
      </View>

      {/* Svg tabanlı roadmap görselleştirmesi */}
      <ScrollView horizontal contentContainerStyle={styles.svgScrollView}>
        <Svg height={canvasSize.height} width={canvasSize.width}>
          {drawableLines.map(line => (
            <Path 
              key={line.id} 
              d={line.path} 
              stroke={colors.yellowAccent} // Sarı renk
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="5, 5" // Kesikli çizgi
            />
          ))}
          {drawableNodes.map(node => {
            const isExpanded = expandedNodes.has(node.id);
            const canExpand = node.children && node.children.length > 0;
            const isRootNode = node.id === selectedRoadmap.nodes[0].id;
            return (
              <G key={node.id} onPress={() => canExpand && toggleNode(node.id)}>
                <Rect 
                  x={node.x} 
                  y={node.y} 
                  width={node.width} 
                  height={node.height} 
                  fill={isRootNode ? colors.primary : colors.cardBackground}
                  stroke={isExpanded ? colors.yellowAccent : colors.border}
                  strokeWidth="2" 
                  rx={10} 
                />
                <SvgText 
                  x={node.x + node.width / 2} 
                  y={node.y + node.height / 2 + 5} 
                  fill={isRootNode ? colors.white : colors.text}
                  fontSize={getNodeFontSize(node.level)} // Seviyeye göre font boyutu
                  fontWeight="bold" 
                  textAnchor="middle"
                  textLength={node.width - 30}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {node.title}
                </SvgText>
                {canExpand && (
                  <SvgText 
                    x={node.x + node.width - 15}
                    y={node.y + node.height - 10}
                    fill={isRootNode ? colors.white : colors.textSecondary}
                    fontSize="20"
                    textAnchor="end"
                  >
                    {isExpanded ? '−' : '+'}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      {/* Yorumlar Bölümü - Toggle ile açılıp kapanacak */}
      <View style={styles.commentsContainer}>
        <TouchableOpacity onPress={toggleCommentsSection} style={styles.commentsToggleHeader}>
          <Text style={styles.commentsTitle}>Yorumlar ({comments.length})</Text>
          <Text style={styles.toggleIcon}>{showCommentsSection ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showCommentsSection && (
          <View style={styles.commentsContent}>
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
                    <Text style={styles.commentAuthor}>{item.username}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                  </View>
                )}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error, 
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  detailHeader: {
    padding: PADDING,
    marginBottom: PADDING,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    marginHorizontal: PADDING,
    marginTop: PADDING,
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
    alignItems: 'center',
    paddingBottom: PADDING,
    marginHorizontal: PADDING,
  },
  commentsContainer: {
    marginTop: PADDING,
    marginHorizontal: PADDING,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  commentsToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  toggleIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  commentsContent: {
    padding: PADDING,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.background,
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
    maxHeight: 100,
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
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentItem: {
    backgroundColor: colors.background,
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
