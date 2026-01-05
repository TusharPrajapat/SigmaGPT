const test = {
  id: "chatcmpl-c803e9a7-6ca6-4b99-ae43-bac709d3340d",
  object: "chat.completion",
  created: 1767378258,
  model: "llama-3.1-8b-instant",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content:
          "Why did the computer go to the doctor?\n\nBecause it had a virus.",
      },
      logprobs: null,
      finish_reason: "stop",
    },
  ],
  usage: {
    queue_time: 0.055335304,
    prompt_tokens: 42,
    prompt_time: 0.001916666,
    completion_tokens: 16,
    completion_time: 0.022685245,
    total_tokens: 58,
    total_time: 0.024601911,
  },
  usage_breakdown: null,
  system_fingerprint: "fp_f757f4b0bf",
  x_groq: { id: "req_01kdzz82kzfenbbv12ccy7bfj0", seed: 135362909 },
  service_tier: "on_demand",
};
