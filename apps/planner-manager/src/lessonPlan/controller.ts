import { FastifyRequest, FastifyReply } from 'fastify';
import { lessonPlanDal } from './DAL'; 
import { CreateLessonPlanDto } from './schema';
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
};