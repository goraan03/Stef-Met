import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
    email: z.string().email('Unesite validnu email adresu'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Poruka mora imati najmanje 10 karaktera'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;