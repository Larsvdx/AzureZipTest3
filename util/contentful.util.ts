export function generateContentfulId(contentModel: string, id: number | string) {
    if(!contentModel) throw Error(`contentModel is a required filled in argument - ${contentModel}`);
    if(!id || id === 0) throw Error(`id is required (${contentModel}): bigger than zero argument - or a value - ${id}`);

    return `${contentModel.toLowerCase()}-${id}`;
}


export function kebabToCamel(kebabCase: string): string {
    const words = kebabCase.split('-');
    const camelCaseWords = words.map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    );
    return camelCaseWords.join('');
}
