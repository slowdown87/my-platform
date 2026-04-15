export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages, model } = await request.json();

    // 获取用户最新的问题
    const userMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // 第一步：用 Tavily 搜索最新信息
    let searchResults = null;
    try {
      const tavilyResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: userMessage,
          max_results: 3,
          include_answer: true,
        }),
      });
      searchResults = await tavilyResponse.json();
    } catch (searchError) {
      // 搜索失败不影响对话，继续使用 AI 自身知识
      console.log("搜索失败，使用 AI 自身知识:", searchError.message);
    }

    // 第二步：构建带搜索结果的提示词
    let enhancedMessages = [...messages];

    if (
      searchResults &&
      searchResults.results &&
      searchResults.results.length > 0
    ) {
      // 有搜索结果，把结果附加到系统提示中
      const searchContext = searchResults.results
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}\n来源: ${r.url}`)
        .join("\n\n");

      const systemMessage = {
        role: "system",
        content: `你是一个有帮助的AI助手。以下是从互联网搜索到的最新信息，请参考这些信息回答用户的问题。如果搜索结果中没有相关信息，请使用你自身的知识回答，并说明信息可能不是最新的。

搜索结果：
${searchContext}

请用中文回答，并在适当的地方标注信息来源。`,
      };

      // 把系统消息放在最前面
      enhancedMessages = [systemMessage, ...messages];
    }

    // 第三步：调用百炼 AI 生成回答
    const response = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BAILIAN_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || "qwen-turbo",
          messages: enhancedMessages,
          enable_search: false, // 关闭百炼自带的联网搜索（用 Tavily 代替，省钱）
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "API 调用失败");
    }

    // 第四步：在回答中附加搜索来源
    let finalContent = data.choices[0].message.content;

    if (
      searchResults &&
      searchResults.results &&
      searchResults.results.length > 0
    ) {
      const sources = searchResults.results
        .map((r) => `- [${r.title}](${r.url})`)
        .join("\n");

      finalContent += "\n\n---\n📚 **参考来源**：\n" + sources;
    }

    // 返回修改后的结果
    data.choices[0].message.content = finalContent;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
