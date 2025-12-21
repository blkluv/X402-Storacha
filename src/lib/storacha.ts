import { create } from '@storacha/client'

let client: any = null;

try {
  if (process.env.STORACHA_EMAIL && process.env.STORACHA_SPACE_DID) {
    client = create({
      email: process.env.STORACHA_EMAIL,
      space: process.env.STORACHA_SPACE_DID
    });
  }
} catch (error) {
  console.warn('Storacha client not configured:', error);
}

export async function uploadToStoracha(file: File): Promise<string> {
  if (!client) {
    // Return mock CID if Storacha not configured
    return `bafkreimock${Date.now()}`;
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const cid = await client.uploadFile(uint8Array);
    return cid.toString();
  } catch (error) {
    console.error('Storacha upload failed:', error);
    return `bafkreimock${Date.now()}`;
  }
}

export async function retrieveFromStoracha(cid: string): Promise<Uint8Array> {
  if (!client) {
    // Return mock data if Storacha not configured
    return new Uint8Array(Buffer.from(`Mock file data for CID: ${cid}`));
  }
  
  try {
    const data = await client.downloadFile(cid);
    return data;
  } catch (error) {
    console.error('Storacha retrieval failed:', error);
    return new Uint8Array(Buffer.from(`Mock file data for CID: ${cid}`));
  }
}