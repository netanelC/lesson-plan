import axios from 'axios';
import { FastifyRequest, FastifyReply } from 'fastify';
import { lessonPlanDal } from './DAL'; 
import { CreateLessonPlanDto } from '@repo/types';
import { fileStorageService } from 'src/file-storage';

export const lessonPlanController = {

  create: async (
    req: FastifyRequest<{ Body: CreateLessonPlanDto }>, 
    reply: FastifyReply
  ) => {

    const planData = req.body;
    // Call the DAL
    // We are hardcoding the author for now until we add Login later.
    const newPlan = await lessonPlanDal.create(planData, 'nati');

    // Send back 201 (Created) and the data
    return reply.code(201).send(newPlan);
  },

  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    const plans = await lessonPlanDal.getAll();
    return reply.code(200).send(plans);
  },

  getOne: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const plan = await lessonPlanDal.getById(id);

    if (!plan) {
      return reply.code(404).send({ message: 'Lesson plan not found' });
    }

    return reply.code(200).send(plan);
  },

  update: async (
    req: FastifyRequest<{ Params: { id: string }; Body: CreateLessonPlanDto }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      // 1. Check if it exists
      const existing = await lessonPlanDal.getById(id);
      if (!existing) {
        return reply.code(404).send({ message: 'המערך לא נמצא' });
      }

      // 2. Perform update
      const updatedPlan = await lessonPlanDal.update(id, updateData);
      return reply.code(200).send(updatedPlan);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: 'שגיאה בעדכון המערך' });
    }
  },

  delete: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    await lessonPlanDal.delete(id);
    // 204 No Content is the standard for successful deletion
    return reply.code(204).send();
  },

  uploadAttachment: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    // 1. Get the file from the request stream
    const data = await req.file();
    if (!data) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    const lessonPlanId = req.params.id;

    // 2. Upload to MinIO using our service
    // We convert the stream to a Buffer for the S3 SDK
    const fileBuffer = await data.toBuffer();
    const uploadResult = await fileStorageService.uploadFile(
      lessonPlanId,
      fileBuffer,
      data.filename,
      data.mimetype
    );

    // 3. Save the metadata to Postgres
    const attachment = await lessonPlanDal.addAttachment(lessonPlanId, {
      filename: uploadResult.filename,
      url: uploadResult.url,
      fileType: data.mimetype,
      sizeBytes: fileBuffer.length,
    });

    return reply.code(201).send(attachment);
  },

  downloadAttachment: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    
    // 1. Get attachment metadata from DB
    const attachment = await lessonPlanDal.getAttachmentById(id);
    if (!attachment) {
      return reply.code(404).send({ message: 'Attachment not found' });
    }

    try {
      // 2. Fetch the file stream from MinIO (Internal Network Call)
      const response = await axios.get(attachment.url, {
        responseType: 'stream',
      });

      // 3. Set headers to FORCE download and hide the origin
      reply.header('Content-Type', attachment.fileType);
      // This header tells the browser: "Don't open this! Save it as..."
      reply.header(
        'Content-Disposition', 
        `attachment; filename="${encodeURIComponent(attachment.filename)}"`
      );

      // 4. Send the stream
      return reply.send(response.data);

    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: 'Failed to download file' });
    }
  },

  removeAttachment: async (
    req: FastifyRequest<{ Params: { fileId: string } }>,
    reply: FastifyReply
  ) => {
    const { fileId } = req.params;

    try {
      // 1. Get the attachment metadata from the DB
      const attachment = await lessonPlanDal.getAttachmentById(fileId);
      if (!attachment) {
        return reply.code(404).send({ message: 'הקובץ לא נמצא' });
      }

      // 2. Extract the MinIO key from the URL 
      // Example URL: .../lesson-attachments/PLAN_ID/filename.pdf
      const key = attachment.url.split('lesson-attachments/')[1];

      if (key) {
        // 3. Delete from MinIO
        await fileStorageService.deleteFile(key);
      }

      // 4. Delete the record from Postgres
      await lessonPlanDal.deleteAttachment(fileId);

      return reply.code(204).send();
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: 'שגיאה במחיקת הקובץ' });
    }
  },
};