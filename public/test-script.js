/* eslint-disable no-undef */
const selectAsset = () => {
    return new Promise(resolve => resolve([
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg'
        },
        {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adams_The_Tetons_and_the_Snake_River.jpg/1280px-Adams_The_Tetons_and_the_Snake_River.jpg'
        }
    ]));
};

const selectContents = () => {
    return new Promise(resolve => resolve([
        {
            href: 'https://squidex.io', title: 'Squidex'
        },
        {
            href: 'https://squidex.io', title: 'Squidex'
        }
    ]));
};

const textarea1 = document.getElementById('textarea1');
const textarea2 = document.getElementById('textarea2');

new SquidexEditorWrapper(document.getElementById('editor1'), {
    mode: 'Markdown',
    canSelectAssets: true,
    onSelectAssets: selectAsset,
    onSelectContents: selectContents,
    onChange: value => {
        textarea1.value = value;
    }
});

new SquidexEditorWrapper(document.getElementById('editor2'), {
    mode: 'Html',
    canSelectContents: true,
    onSelectAssets: selectAsset,
    onSelectContents: selectContents,
    onChange: value => {
        textarea2.value = value;
    }
});