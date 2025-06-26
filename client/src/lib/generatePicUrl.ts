const randomString = Math.floor(1 + Math.random() * 100).toString();

export const generatePicUrl = () => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomString}`;
};
