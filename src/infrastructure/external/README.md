# external

Wrappers around third-party SDKs the app depends on but doesn't own (push notifications, analytics, payments, maps, etc.). Each wrapper should expose a small interface consumed by `domain`/`application`, so the SDK itself is only imported here.
