export const mixin = {
  props: {
    scope: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },
}
