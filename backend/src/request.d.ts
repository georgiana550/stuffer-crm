import { DecryptedApplicationTicket } from './common/ubiservices/auth/decrypted-application-ticket';
import { DecryptedProfileTicket } from './common/ubiservices/auth/decrypted-profile-ticket';
import { User } from './common/database/entities/user.entity';
import { Client } from './common/database/entities/client.entity';
import { AdminUser } from './common/database/entities/admin-user.entity';

declare module 'express-serve-static-core' {
    interface Request {
        transactionId: string;
        applicationId?: string;
        rawTicket?: string;
        profileTicket?: DecryptedProfileTicket;
        applicationTicket?: DecryptedApplicationTicket;
        applicationPermissions?: string[];
        partnerTicket?: PartnerClientTicket;
        user?: User;
        client?: Client;
        adminPermissions?: string[];
        adminUser?: AdminUser;
        ipCountryCode?: string;
    }
}
