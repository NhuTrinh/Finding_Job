
import InvalidCredentialsError from '../../shared/exceptions/InvalidCredentialsError.exception.js';
import CandidateService from '../../services/candidate.service.js';
import { apiSuccess } from '../../shared/helpers/apiResponse.helper.js';

class CandidateController {

     // 1. Tính năng xem hồ sơ ITVIEC
     static async apiGetProfile(req, res, next) {
          try {
               const accountId = req.account?.accountId;
               if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

               const response = await CandidateService.getProfileByAccountId(accountId);
               return apiSuccess(res, response, 200);
          } catch (error) {
               next(error);
          }
     }

     // 2. Tính năng sửa hồ sơ ITVIEC
     static async apiUpdateProfile(req, res, next) {
          try {
               const accountId = req.account?.accountId;
               if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

               const newProfile = req.body;
               const updatedProfile = await CandidateService.updateProfileByAccountId(accountId, newProfile);

               return apiSuccess(res, updatedProfile, 200);
          } catch (error) {
               next(error);
          }
     }

     // 3. Tính năng xem hồ sơ đính kèm
     static async apiGetAttachments(req, res, next) {
          try {
               const accountId = req.account?.accountId;
               if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

               const result = await CandidateService.getAttachmentsByAccountId(accountId);
               return apiSuccess(res, result, 200);
          } catch (error) {
               next(error);
          }
     }

     // 4. Tính năng sửa hồ sơ đính kèm
     static async apiUpdateAttachments(req, res, next) {
          try {
               const accountId = req.account?.accountId;
               if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

               const newAttachments = req.body;
               const result = await CandidateService.updateAttachmentsByAccountId(accountId, newAttachments);

               return apiSuccess(res, result, 200);
          } catch (error) {
               next(error);
          }
     }
}

export default CandidateController;