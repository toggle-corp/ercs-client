function toSafeMediaUrl(src: string) {
    if (!src.startsWith('http')) {
        return src;
    }
    return src.replace(/^http:\/\/web:8000/, 'http://localhost:8000');
}

export default toSafeMediaUrl;
