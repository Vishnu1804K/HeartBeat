interface EmailOptions {
    email: string;
    subject: string;
    html: string;
}
declare const sendEmail: (options: EmailOptions) => Promise<void>;
export default sendEmail;
//# sourceMappingURL=sendEmail.d.ts.map