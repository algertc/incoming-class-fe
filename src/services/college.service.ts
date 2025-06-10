import { request } from "../hooks/api/http.client";

class CollegeService {

    async getColleges(searchQuery?: string) {
        const response = await request({
            url: `/colleges`,
            method: 'GET',
            params: {
                page: 1,
                limit: 6,
                search:searchQuery
            }
        });
        return response;
    }
}

export default new CollegeService();