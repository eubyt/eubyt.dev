export type GithubUser = {
    login: string;
    name: string | null;
    avatar_url: string;
};

const AVATAR_SIZE = 256;

function withAvatarSize(avatarUrl: string) {
    const url = new URL(avatarUrl);
    url.searchParams.set("s", String(AVATAR_SIZE));
    return url.toString();
}

export async function getGithubUser(username: string): Promise<GithubUser> {
    const response = await fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 1 },
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "eubyt-portfolio",
        },
    });

    if (!response.ok) {
        throw new Error(
            `GitHub user "${username}" not found (${response.status})`,
        );
    }

    const data = (await response.json()) as {
        login: string;
        name: string | null;
        avatar_url: string;
    };

    return {
        login: data.login,
        name: data.name,
        avatar_url: withAvatarSize(data.avatar_url),
    };
}
