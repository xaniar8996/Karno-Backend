// Replace express-mongo-sanitize with an in-process safe sanitizer
function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        // If key contains a dot or starts with $, replace them
        const safeKey = key.replace(/^\$+/, "_").replace(/\./g, "_");
        if (safeKey !== key) {
            obj[safeKey] = value;
            try { delete obj[key]; } catch (e) { /* ignore non-writable */ }
        }
        // If value is a string, sanitize it
        if (typeof value === 'string') {
            obj[safeKey] = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/[<>]/g, "");
        } else if (value && typeof value === 'object') {
            // Recurse for nested objects
            sanitizeObject(value);
        }
    });
}

module.exports = sanitizeObject