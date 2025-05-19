function addFlagToChart(chart, time, price) {
  try {
    if (chart) {
      chart.createShape({
        time: Math.floor(time / 1000),
        price: price,
        text: "DB",
        shape: "label",
        filled: true,
        style: 2,
        textColor: "#FFFFFF",
        color: "#00b15d",
        backgroundColor: "#00b15d",
        lock: true,
        disableSelection: true,
        disableSave: true,
        overrideMinSize: true,
        zOrder: "top",
      });
    }
  } catch (error) {
    console.log("🚀 ~ addFlagToChart ~ error:", error?.message);
  }
}

export { addFlagToChart };
