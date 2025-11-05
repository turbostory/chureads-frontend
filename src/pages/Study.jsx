import React from "react";
import Greeting from "../components/study/Greeting";
import Counter from "../components/study/Counter";

const Study = () => {
  return (
    <div>
      <Greeting />
      <Greeting username="후츠릿" />
      <Greeting username="배홍진" />
      <Counter />
    </div>
  );
};

export default Study;
