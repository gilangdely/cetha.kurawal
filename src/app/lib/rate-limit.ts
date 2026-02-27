type RateLimitInfo = {
    count: number;
    resetTime: number;
};

// Global map to hold the hits (clears on server restart, fine for baseline)
const rateLimitMap = new Map<string, RateLimitInfo>();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
    const now = Date.now();
    const info = rateLimitMap.get(ip);

    // Lazy cleanup of the old entry
    if (info && info.resetTime < now) {
        rateLimitMap.delete(ip);
    }

    const currentInfo = rateLimitMap.get(ip);

    // New IP hit
    if (!currentInfo) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        return { success: true };
    }

    // IP Exceeded limit
    if (currentInfo.count >= limit) {
        return { success: false, resetTime: currentInfo.resetTime };
    }

    // Increment hit count
    currentInfo.count += 1;
    return { success: true };
}
