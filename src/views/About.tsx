import * as tsx from "vue-tsx-support";

export default tsx.component({
  name: "About",
  props: {
    // label: {
    //   type: String,
    //   required: true as true
    // }
  },
  render() {
    return (
      <div>
        <h1>About</h1>
      </div>
    );
  }
});
