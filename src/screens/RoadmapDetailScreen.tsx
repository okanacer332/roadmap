// src/screens/RoadmapDetailScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Path, G } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ROADMAPS, RoadmapNode } from '../data/dummyData';
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

const RoadmapDetailScreen = ({ route }: Props) => {
  const { roadmapId } = route.params;
  const selectedRoadmap = ROADMAPS.find(roadmap => roadmap.id === roadmapId);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newSet = new Set(expandedNodes);
    if (newSet.has(nodeId)) {
      newSet.delete(nodeId);
    } else {
      newSet.add(nodeId);
    }
    setExpandedNodes(newSet);
  };

  const { drawableNodes, drawableLines, canvasSize } = useMemo(() => {
    if (!selectedRoadmap) return { drawableNodes: [], drawableLines: [], canvasSize: { width: 0, height: 0 } };

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
        const startY = parentNode.y + BOX_HEIGHT;
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
    layout(selectedRoadmap.nodes[0], baseCanvasWidth, PADDING);

    // Adjust all coordinates so the leftmost element is at PADDING
    const shiftX = PADDING - canvasBounds.minX;
    const finalNodes = nodesToDraw.map(n => ({ ...n, x: n.x + shiftX }));
    const finalLines = linesToDraw.map(l => {
      const points = l.path.split(/[ ,C]/).filter(p => p !== 'M' && p !== '');
      const newPath = `M ${+points[0] + shiftX},${points[1]} C ${+points[2] + shiftX},${points[3]} ${+points[4] + shiftX},${points[5]} ${+points[6] + shiftX},${points[7]}`;
      return { ...l, path: newPath };
    });

    return {
      drawableNodes: finalNodes,
      drawableLines: finalLines,
      canvasSize: { width: canvasBounds.maxX - canvasBounds.minX + PADDING * 2, height: canvasBounds.maxY + PADDING },
    };
  }, [selectedRoadmap, expandedNodes]);

  if (!selectedRoadmap) { /* ... */ }

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal>
        <StatusBar barStyle="light-content" />
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
            )
          })}
        </Svg>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default RoadmapDetailScreen;