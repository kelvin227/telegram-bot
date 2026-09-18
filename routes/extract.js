function extractMessageContent(ctx) {
  const message = ctx.message;

  if (!message) return "";

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

  // Polls — question + all options, a common spam vector precisely
  // because it has neither .text nor .caption
  if (message.poll) {
    content += ` ${message.poll.question || ""}`;
    for (const option of message.poll.options || []) {
      content += ` ${option.text || ""}`;
    }
  }

  // Venue / location cards used to smuggle a promo title+address
  if (message.venue) {
    content += ` ${message.venue.title || ""} ${message.venue.address || ""}`;
  }

  // Contact cards — spammers sometimes stuff a promo into the name fields
  if (message.contact) {
    content += ` ${message.contact.first_name || ""} ${message.contact.last_name || ""}`;
  }

  // Sticker emoji + set name — no real text, but gives the scorer
  // something to look at instead of a totally blank string
  if (message.sticker) {
    content += ` ${message.sticker.emoji || ""} ${message.sticker.set_name || ""}`;
  }

  // File names on documents/animations/audio sometimes carry the pitch
  if (message.document?.file_name) {
    content += ` ${message.document.file_name}`;
  }
  if (message.animation?.file_name) {
    content += ` ${message.animation.file_name}`;
  }
  if (message.audio?.title) {
    content += ` ${message.audio.title} ${message.audio.performer || ""}`;
  }

  // "rich_message" blocks — a non-standard structured-text field (seen
  // on forwarded messages from certain bots) where each block's `text`
  // is an array mixing plain strings with inline objects like mentions
  // ({ type: "mention", text: "@user", username: "user" }) or links
  // ({ type: "link", text: "...", url: "..." }). Neither .text nor
  // .caption exists on these messages, so without this the entire
  // message content is invisible to the spam scorer.
  if (message.rich_message?.blocks) {
    for (const block of message.rich_message.blocks) {
      const parts = Array.isArray(block.text) ? block.text : [block.text];
      for (const part of parts) {
        if (typeof part === "string") {
          content += ` ${part}`;
        } else if (part && typeof part === "object") {
          if (part.type === "mention" && part.username) {
            content += ` @${part.username}`;
          } else if (part.text) {
            content += ` ${part.text}`;
          } else if (part.username) {
            content += ` @${part.username}`;
          }
          if (part.url) content += ` ${part.url}`;
        }
      }
    }
  }

  return content.trim();
}

module.exports = extractMessageContent;