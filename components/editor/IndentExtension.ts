import { Extension } from '@tiptap/core';

export interface IndentOptions {
  types: string[];
  indentLevels: number[];
  defaultIndentLevel: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      indentLevels: [0, 2, 4, 6, 8],
      defaultIndentLevel: 0,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            parseHTML: (element) => {
              const indentValue = element.getAttribute('data-indent');
              return indentValue ? parseInt(indentValue, 10) : this.options.defaultIndentLevel;
            },
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent === 0) {
                return {};
              }
              return {
                'data-indent': attributes.indent,
                style: `text-indent: ${attributes.indent}em;`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ commands, state }) => {
          const { selection } = state;
          const { $from } = selection;
          const node = $from.node();

          if (!this.options.types.includes(node.type.name)) {
            return false;
          }

          const currentIndent = node.attrs.indent || 0;
          const maxIndent = Math.max(...this.options.indentLevels);

          if (currentIndent >= maxIndent) {
            return false;
          }

          const nextIndent = this.options.indentLevels.find(
            (level) => level > currentIndent
          ) || currentIndent;

          return commands.updateAttributes(node.type.name, {
            indent: nextIndent,
          });
        },

      outdent:
        () =>
        ({ commands, state }) => {
          const { selection } = state;
          const { $from } = selection;
          const node = $from.node();

          if (!this.options.types.includes(node.type.name)) {
            return false;
          }

          const currentIndent = node.attrs.indent || 0;

          if (currentIndent === 0) {
            return false;
          }

          const prevIndent = [...this.options.indentLevels]
            .reverse()
            .find((level) => level < currentIndent) || 0;

          return commands.updateAttributes(node.type.name, {
            indent: prevIndent,
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});
