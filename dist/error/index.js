import general from './general';
const errors = {
    general
};
export const error = (options, error) => `
    <div class="chartisan-help-block">
    <div class="chartisan-refresh-chart">
        ${errors[options.type](options)}
    </div>
    ${options.text != ''
    ? `
                <div class="chartisan-help-text" style="color: ${options.textColor};">
                    ${options.text}
                </div>
            `
    : ''}
    ${options.debug
    ? `<div class="chartisan-help-text-error">
        ${error.message}
    </div>`
    : ''}
    </div>
`;
