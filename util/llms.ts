export function encodeLLMChatUrl(url: string) {
    const prompt = encodeURIComponent(`Read from ${url} so I can ask questions about it.`);

    return {
        chatGpt: `https://chatgpt.com/?hints=search&q=${prompt}`,
        claude: `https://claude.ai/new?q=${prompt}`,
    };
}

export type LLMChatURLs = ReturnType<typeof encodeLLMChatUrl>;
