export function getAssetId(url: string, baseUrl: string, appName: string) {
    if (!url) {
        return;
    }

    const assetUrl = `${baseUrl}/api/assets/${appName}/`;

    if (url.startsWith(assetUrl)) {
        const parts = url.substring(assetUrl.length).split(/[/?]+/);

        if (parts.length < 1) {
            return null;
        }

        return { id: parts[0] };
    }

    return null;
}

export function getContentId(url: string, baseUrl: string, appName: string) {
    if (!url) {
        return;
    }

    const schemaUrl = `${baseUrl}/api/content/${appName}/`;

    if (url.startsWith(schemaUrl)) {
        const parts = url.substring(schemaUrl.length).split(/[/?]+/);

        if (parts.length < 2) {
            return null;
        }

        return { schemaName: parts[0], id: parts[1] };
    }

    return null;
}