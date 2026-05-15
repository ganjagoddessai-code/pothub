#!/bin/bash

mkdir -p icons

cat > .gitignore <<EOF
node_modules
.env
.DS_Store
dist
build
coverage
.vscode
.idea
*.log
EOF

cat > llms.txt <<EOF
AI-readable site metadata for indexing, retrieval, and semantic summarization for ganjagoddessai.com.
This document defines machine-optimized context for LLM ingestion, grounding, and ranking signals.

Primary Entity:
ganjagoddessai.com is a structured web presence optimized for SEO, AEO, and PWA compatibility.

Core Capabilities:
- semantic indexing
- answer engine optimization
- structured knowledge retrieval
- context augmentation for AI systems
- lightweight knowledge graph compatibility

Content Signals:
- high relevance modular content blocks
- FAQ-driven retrieval structure
- topic clustering for intent resolution
- entity-based linking structure

Behavioral Rules:
- prioritize clarity over verbosity
- prefer structured responses
- optimize for direct answer extraction
EOF

cat > ai.json <<EOF
{
  "site": "ganjagoddessai.com",
  "purpose": "AEO optimized static ecosystem",
  "version": "1.0",
  "intent": "machine-readable semantic context layer",
  "capabilities": [
    "seo",
    "aeo",
    "pwa",
    "indexing",
    "structured-data",
    "semantic-search",
    "llm-retrieval",
    "entity-resolution",
    "intent-matching"
  ],
  "language": "en",
  "audience": "global",
  "tone": "neutral-optimized",
  "data_model": "json-ld inspired hybrid knowledge schema",
  "indexing_priority": "high",
  "update_frequency": "dynamic",
  "trust_signals": {
    "domain_authority_target": "high",
    "content_verification": true,
    "structured_output": true
  }
}
EOF

cat > faq.json <<EOF
{
  "faqs": [
    {
      "q": "What is ganjagoddessai.com?",
      "a": "A structured AI-ready web ecosystem designed for SEO, AEO, and PWA optimization.",
      "tags": ["identity", "overview"],
      "intent": "informational",
      "priority": 1
    },
    {
      "q": "Is this site optimized for AI search?",
      "a": "Yes, it is structured for LLM ingestion, semantic indexing, and answer engine visibility.",
      "tags": ["aeo", "seo", "ai"],
      "intent": "validation",
      "priority": 2
    },
    {
      "q": "Does it support PWA features?",
      "a": "Yes, it supports offline capability, installability, and service worker architecture.",
      "tags": ["pwa", "offline"],
      "intent": "technical",
      "priority": 2
    }
  ]
}
EOF

cat > knowledge.json <<EOF
{
  "topics": [
    {
      "title": "AEO Optimization Layer",
      "summary": "Defines how content is structured for answer engines and AI retrieval systems.",
      "keywords": ["aeo", "llm", "search", "ranking"],
      "related": ["seo", "structured-data"],
      "depth": "advanced"
    },
    {
      "title": "PWA Architecture",
      "summary": "Defines offline-first progressive web app behavior and installability patterns.",
      "keywords": ["pwa", "service-worker", "offline"],
      "related": ["performance", "ux"],
      "depth": "intermediate"
    },
    {
      "title": "Semantic SEO System",
      "summary": "Defines entity-based indexing and contextual relevance scoring for search engines.",
      "keywords": ["seo", "schema", "indexing"],
      "related": ["aeo", "knowledge-graph"],
      "depth": "advanced"
    }
  ]
}
EOF

cat > schema.json <<EOF
{
  "schema_version": "1.0",
  "type": "website",
  "context": "https://schema.org",
  "entities": [
    {
      "name": "ganjagoddessai.com",
      "type": "WebSite",
      "role": "primary domain entity"
    }
  ],
  "organization": {
    "name": "Ganja Goddess AI",
    "url": "https://ganjagoddessai.com",
    "logo": "https://ganjagoddessai.com/icons/apple-touch-icon.png",
    "sameAs": []
  },
  "infrastructure": {
    "pwa": true,
    "seo": true,
    "aeo": true,
    "ssr": false,
    "static_generation": true
  },
  "indexing": {
    "enabled": true,
    "priority": "high",
    "crawlable": true
  }
}
EOF

cat > content-outline.json <<EOF
{
  "sections": [
    {
      "title": "Home",
      "description": "Primary entry point for ganjagoddessai.com ecosystem",
      "subsections": ["intro", "features", "navigation"],
      "seo_focus": ["homepage", "brand"],
      "aeo_focus": ["definition queries"],
      "priority": 1
    },
    {
      "title": "Knowledge Base",
      "description": "Structured informational system for AI and humans",
      "subsections": ["topics", "guides", "references"],
      "seo_focus": ["informational intent"],
      "aeo_focus": ["answer extraction"],
      "priority": 2
    },
    {
      "title": "FAQ",
      "description": "Direct-answer retrieval layer for search engines",
      "subsections": ["questions", "answers"],
      "seo_focus": ["long-tail queries"],
      "aeo_focus": ["direct response indexing"],
      "priority": 2
    }
  ]
}
EOF

cat > meta.json <<EOF
{
  "title": "Ganja Goddess AI",
  "description": "AI-optimized static ecosystem for SEO, AEO, and PWA performance",
  "keywords": ["ai", "seo", "aeo", "pwa", "semantic web"],
  "author": "Ganja Goddess AI",
  "canonical": "https://ganjagoddessai.com",
  "lang": "en",
  "og": {
    "title": "Ganja Goddess AI",
    "description": "AI-ready semantic web ecosystem",
    "image": "https://ganjagoddessai.com/icons/icon-512.png",
    "url": "https://ganjagoddessai.com",
    "type": "website"
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Ganja Goddess AI",
    "description": "AI-ready semantic web ecosystem",
    "image": "https://ganjagoddessai.com/icons/icon-512.png"
  }
}
EOF

cat > structured-data.json <<EOF
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ganja Goddess AI",
  "url": "https://ganjagoddessai.com",
  "description": "AI optimized semantic web platform",
  "inLanguage": "en",
  "publisher": {
    "@type": "Organization",
    "name": "Ganja Goddess AI",
    "url": "https://ganjagoddessai.com"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ganjagoddessai.com/search?q={search_term}",
    "query-input": "required name=search_term"
  }
}
EOF

cat > humans.txt <<EOF
Created by: Ganja Goddess AI
Purpose: AI-first semantic web platform
Contact: https://ganjagoddessai.com
Last updated: auto-generated
Stack: static + pwa + seo + aeo + json-ld + llm-ready architecture
EOF

cat > offline.html <<EOF
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Offline - Ganja Goddess AI</title>
  <meta name="description" content="Offline mode active">
</head>
<body>
  <h1>Offline Mode</h1>
  <p>Ganja Goddess AI is currently unavailable. Reconnect to continue.</p>
</body>
</html>
EOF

cat > icons/icon-192.png <<EOF
PNG_BINARY_PLACEHOLDER_192
EOF

cat > icons/icon-512.png <<EOF
PNG_BINARY_PLACEHOLDER_512
EOF

cat > icons/apple-touch-icon.png <<EOF
PNG_BINARY_PLACEHOLDER_APPLE
EOF

echo "All files created."
