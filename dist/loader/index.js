import bar from './bar';
const loaders = {
    bar
};
export const loader = (options) => `
    <div class="chartisan-help-block">
        ${loaders[options.type](options)}
        ${options.text != ''
    ? `
                    <div class="chartisan-help-text" style="color: ${options.textColor};">
                        ${options.text}
                    </div>
                `
    : ''}
    </div>
`;
