
function extractMessageContent(ctx) {
  const message = ctx.message;

  let content = "";

  // Normal text
  if (message.text) {
    content += ` ${message.text}`;
  }

  // Photo/video/document captions
  if (message.caption) {
    content += ` ${message.caption}`;
  }

  // Inline keyboard buttons
  if (message.reply_markup?.inline_keyboard) {
    for (const row of message.reply_markup.inline_keyboard) {
      for (const button of row) {
        if (button.text) {
          content += ` ${button.text}`;
        }

        if (button.url) {
          content += ` ${button.url}`;
        }
      }
    }
  }

  return content.trim();
}

module.exports = extractMessageContent;
