export const prompts = [
  {
    id: 1,
    userId: 1,
    prompt: "Create a cyberpunk story about an AI that learns to dream",
    example: "In the neon-lit streets of Neo Tokyo, where binary rain falls like digital tears...",
    upvotes: 156,
    timestamp: "2024-03-15T10:30:00",
    category: "Creative Writing"
  },
  {
    id: 2,
    userId: 3,
    prompt: "Generate a detailed technical architecture for a scalable microservices system",
    example: "System Architecture:\n1. API Gateway Layer\n2. Service Mesh\n3. Containerized Services...",
    upvotes: 243,
    timestamp: "2024-03-15T09:15:00",
    category: "Technical"
  },
  {
    id: 3,
    userId: 2,
    prompt: "Design a futuristic UI for a space exploration app",
    example: "Key features:\n- Dark theme with nebula backgrounds\n- Holographic controls\n- 3D planet viewer\n- Real-time space station tracking",
    upvotes: 187,
    timestamp: "2024-03-16T11:20:00",
    category: "UI/UX"
  },
  {
    id: 4,
    userId: 4,
    prompt: "Create an AI-powered virtual pet companion system",
    example: "The pet should:\n- Learn from user interactions\n- Show emotional responses\n- Adapt behavior patterns\n- Remember past interactions",
    upvotes: 165,
    timestamp: "2024-03-16T14:45:00",
    category: "AI Systems"
  },
  {
    id: 5,
    userId: 1,
    prompt: "Generate a fantasy world description with unique magic rules",
    example: "In the realm of Etherealia, magic flows through crystalline rivers...",
    upvotes: 142,
    timestamp: "2024-03-16T16:30:00",
    category: "Creative Writing"
  }
];

export const userVotes = {
  // userId_promptId: true
  "1_2": true,
  "2_1": true
};

export const participants = [
  {
    id: 1,
    name: "Alice Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    totalUpvotes: 156,
    promptsSubmitted: 3
  },
  {
    id: 2,
    name: "Bob Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    totalUpvotes: 98,
    promptsSubmitted: 2
  },
  // Add more participants
];
