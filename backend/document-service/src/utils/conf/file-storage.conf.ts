import { diskStorage } from 'multer';
export const defult_storage_config = diskStorage({
    destination: './storage',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
