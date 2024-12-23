import { render, screen } from "@testing-library/react";
import Home from "@/pages/home/Home";

describe("Hello Component", () => {
  it("renders the correct greeting", () => {
    render(<Home />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
