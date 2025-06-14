if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const SERVER_SIDE_BACKEND_URL =
    process.env.SERVER_SIDE_BACKEND_URL || BACKEND_URL;
