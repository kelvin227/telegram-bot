async function handleModeration(ctx, warningResult) {
  const { warningCount, shouldModerate } = warningResult;

  const userId = ctx.from.id;
  const chatId = ctx.chat.id;

  try {
    // ==========================================
    // WARNING 1
    // ==========================================
    if (warningCount === 1) {
      await ctx.reply(
        `⚠️ Warning 1/3

@${ctx.from.username || ctx.from.first_name}, your message appears to violate the group rules.

Please avoid spam, unwanted advertising, or suspicious links.`,
      );

      return {
        action: "warning",
        moderated: false,
      };
    }

    // ==========================================
    // WARNING 2
    // ==========================================
    if (warningCount === 2) {
      await ctx.reply(
        `⚠️ Final Warning 2/3

@${ctx.from.username || ctx.from.first_name}, please stop sending spam or unwanted content.

Further violations may result in your messages being removed or moderation action.`,
      );

      return {
        action: "final_warning",
        moderated: false,
      };
    }

    // ==========================================
    // WARNING 3
    // ==========================================
    if (warningCount === 3) {
      // Delete the spam message
      await ctx.deleteMessage();

      await ctx.reply(
        `🚫 @${ctx.from.username || ctx.from.first_name}, your message was removed after repeated spam warnings.

Please follow the group rules to avoid further restrictions.`,
      );

      return {
        action: "message_deleted",
        moderated: true,
      };
    }

    // ==========================================
    // WARNING 4+
    // ==========================================
    if (warningCount >= 4 && shouldModerate) {
      // Delete the current spam message
      await ctx.deleteMessage();

      // Restrict the user for 1 hour
      const untilDate = Math.floor(Date.now() / 1000) + 60 * 60;

      await ctx.telegram.restrictChatMember(chatId, userId, {
        permissions: {
          can_send_messages: false,
          can_send_audios: false,
          can_send_documents: false,
          can_send_photos: false,
          can_send_videos: false,
          can_send_video_notes: false,
          can_send_voice_notes: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
          can_manage_topics: false,
        },
        until_date: untilDate,
      });

      await ctx.reply(
        `🔇 @${ctx.from.username || ctx.from.first_name} has been temporarily restricted for repeated spam violations.`,
      );

      return {
        action: "restricted",
        moderated: true,
      };
    }

    return {
      action: "none",
      moderated: false,
    };
  } catch (error) {
    console.error("Moderation error:", error);

    return {
      action: "error",
      moderated: false,
      error: error.message,
    };
  }
}

module.exports = handleModeration;