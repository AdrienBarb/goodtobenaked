const Tag = require("../../models/tagModel");

const createTagsIfNotExist = async (tags) => {

    if(!tags || tags.length === 0) {
        return []
    }

    // Convert tags to lowercase for consistency
    const lowerCaseTags = tags.map(tag => tag.toLowerCase());

    // Find existing tags
    const existingTags = await Tag.find({ 'name': { $in: lowerCaseTags } });

    // Create an array of existing tag names
    const existingTagNames = existingTags.map(tag => tag.name);

    // Determine which tags need to be created
    const tagsToCreate = lowerCaseTags.filter(tag => !existingTagNames.includes(tag));

    // Create new tags
    const newTags = await Tag.insertMany(tagsToCreate.map(tag => ({ name: tag })));

    // Combine existing and new tags
    const allTags = [...existingTags, ...newTags];

    return allTags
}

module.exports = createTagsIfNotExist