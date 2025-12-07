export function getTelegramUser() {
    if (!window.Telegram?.WebApp) return null;

    const user = Telegram.WebApp.initDataUnsafe?.user;
    if (!user) return null;

    return {
        telegram_id: user.id.toString(),
        full_name: ${user.first_name} ${user.last_name || ""}.trim(),
        username: user.username || ""
    };
}
