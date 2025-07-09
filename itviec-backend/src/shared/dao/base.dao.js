

export default class BaseDAO {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const doc = await this.model.create(data);
        return doc.toObject({ versionKey: false });
    }

    async findById(id) {
        return this.model.findById(id).lean();
    }

    async findByEmail(email) {
        return this.model.findOne({ email });
    }

    async findAll(filters = {}) {
        return this.model.find(filters);
    }

    async findOne(filter, options = {}) {
        return this.model.findOne(filter, null, options).exec();
    }

    async find(filter = {}, options = {}) {
        return this.model.find(filter, null, options).lean();
    }

    async updateById(id, update) {
        const doc = await this.model.findByIdAndUpdate(id, update, { new: true });
        return doc?.toObject({ versionKey: false });
    }

    async deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }
}
