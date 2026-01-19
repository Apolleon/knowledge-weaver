"use client";
import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network/standalone";

interface Props {
  nodes: string[];
}

export default function KnowledgeGraph({ nodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const graphNodes = new DataSet(
      nodes.map((id) => ({ id, label: id, color: "#ffffff", font: { color: "#000000", weight: "bold" } })),
    );
    const graphEdges = new DataSet([]);

    const network = new Network(
      containerRef.current,
      { nodes: graphNodes, edges: graphEdges },
      {
        physics: { enabled: true },
        layout: { randomSeed: 42 },
      },
    );

    return () => network.destroy();
  }, [nodes]);

  return <div ref={containerRef} className="w-full h-96 bg-black/30 rounded-xl border border-gray-700" />;
}
