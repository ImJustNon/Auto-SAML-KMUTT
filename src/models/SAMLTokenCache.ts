import mongoose, { Schema, Document } from 'mongoose';

export interface ISAMLTokenCache extends Document {
    simpleSAMLphp: string;
    simpleSAMLAuthToken: string;
    updatedAt: Date;
    createdAt: Date;
}

const samlTokenCacheSchema: Schema = new Schema<ISAMLTokenCache>({
    simpleSAMLphp: { 
        type: String, 
        required: true,
    },
    simpleSAMLAuthToken: { 
        type: String, 
        required: true, 
    },
}, {
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt',
    }
});

export const SAMLTokenCache = mongoose.model<ISAMLTokenCache>('SAMLTokenCache', samlTokenCacheSchema);
