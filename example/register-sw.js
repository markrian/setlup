export default function register() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', { scope: './' });
    }
}
