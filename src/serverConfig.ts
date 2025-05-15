import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let vscodeProductJson: any;
async function getVSCodeProductJson() {
    if (!vscodeProductJson) {
        const productJsonStr = await fs.promises.readFile(path.join(vscode.env.appRoot, 'product.json'), 'utf8');
        vscodeProductJson = JSON.parse(productJsonStr);
    }

    return vscodeProductJson;
}

export interface IServerConfig {
    version: string;
    fullVersion: string;
    commit: string;
    quality: string;
    product: string;
    release?: string; // vscodium-like specific
    serverApplicationName: string;
    serverDataFolderName: string;
    serverDownloadUrlTemplate?: string; // vscodium-like specific
}

export async function getVSCodeServerConfig(): Promise<IServerConfig> {
    const productJson = await getVSCodeProductJson();

    const customServerBinaryName = vscode.workspace.getConfiguration('remote.SSH.experimental').get<string>('serverBinaryName', '');

    return {
        fullVersion: productJson.version,
        version: vscode.version.replace('-insider',''),
        commit: productJson.commit,
        product: productJson.urlProtocol || 'vscode',
        quality: productJson.quality,
        release: vscode.version?.split('.')[2] || undefined,
        serverApplicationName: customServerBinaryName || productJson.serverApplicationName,
        serverDataFolderName: productJson.serverDataFolderName,
        serverDownloadUrlTemplate: productJson.serverDownloadUrlTemplate
    };
}
