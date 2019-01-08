import React from "react";
import * as TestRenderer from "react-test-renderer";
import ShallowRenderer from 'react-test-renderer/shallow';
import each from 'jest-each';

import Board, { Square } from "../src/ui";

describe("Board", () => {
  describe("Square", () => {
    it("renders empty black correctly", () => {
      const square = TestRenderer.create(<Square color="black" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black"
/>
`);
    });

    it("renders empty white correctly", () => {
      const square = TestRenderer.create(<Square color="white" />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
/>
`);
    });

    it("renders white man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece man"
  />
</div>
`);
    });

    it("renders white king on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "white", kind: "king" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece white-piece king"
  />
</div>
`);
    });

    it("renders black man on white correctly", () => {
      const square = TestRenderer.create(
        <Square color="white" piece={{ color: "black", kind: "man" }} />
      );
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square white"
>
  <div
    className="piece black-piece man"
  />
</div>
`);
    });

    it("should require a color", () => {
      expect(() => TestRenderer.create(<Square />)).toThrowError(
        "Warning: Failed prop type: The prop `color` is marked as required in `Square`, but its value is `undefined`."
      );
    });

    it("should require a valid color", () => {
      expect(() =>
        TestRenderer.create(<Square color="invalid" />)
      ).toThrowError(
        'Warning: Failed prop type: Invalid prop `color` of value `invalid` supplied to `Square`, expected one of ["white","black"].'
      );
    });

    it("renders empty black selected correctly", () => {
      const square = TestRenderer.create(<Square color="black" selected={ true } />);
      expect(square.toJSON()).toMatchInlineSnapshot(`
<div
  className="square black selected"
/>
`);
    });
  });

  it("should require a turn", () => {
    expect(() => TestRenderer.create(<Board />)).toThrowError(
      "Warning: Failed prop type: The prop `turn` is marked as required in `Board`, but its value is `undefined`."
    );
  });

  it("should reject an invalid turn", () => {
    expect(() => TestRenderer.create(<Board turn="invalid" />)).toThrowError(
      'Warning: Failed prop type: Invalid prop `turn` of value `invalid` supplied to `Board`, expected one of ["white","black"].'
    );
  });

  it("renders correctly when empty", () => {
    const board = TestRenderer.create(<Board pieces={ Array(64).fill(null) } turn="white" />);
    expect(board.toJSON()).toMatchSnapshot();
  });

  const allSquareIndices = Array(64).fill().map((_, i) => i);

  each(allSquareIndices).it("renders white man correctly in square %d", (index) => {
    const pieces = Array(64).fill(null)
    const whiteMan = { color: "white", kind: "man" };
    pieces[index] = whiteMan;
    const board = new ShallowRenderer().render(<Board pieces={ pieces } turn="white" />);
    expect(board.props.children[index].props).toMatchObject({ piece: whiteMan })
  })

  describe('User input', () => {
    each(allSquareIndices).it('should select piece on square %d when clicked', (index) => {
      const pieces = Array(64).fill(null)
      const whiteMan = { color: "white", kind: "man" };
      pieces[index] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" />);

      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(true)
    })

    each(allSquareIndices).it('should unselect piece on square %d when clicked', (index) => {
      const pieces = Array(64).fill(null)
      const whiteMan = { color: "white", kind: "man" };
      pieces[index] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" />);

      propsForSquare(board, index).onClick()
      propsForSquare(board, index).onClick()

      expect(propsForSquare(board, index).selected).toBe(false)
    })

    each(allSquareIndices).it('should not select empty square %d when clicked', (index) => {
      // Arrange
      const board = TestRenderer.create(<Board pieces={ Array(64).fill(null) } turn="white" />);

      // Act
      propsForSquare(board, index).onClick()

      // Assert
      expect(propsForSquare(board, index).selected).toBe(false)
    })

    it('should unselect square 2 when square 5 clicked', () => {
      const pieces = Array(64).fill(null)
      const whiteMan = { color: "white", kind: "man" };
      pieces[2] = pieces[5] = whiteMan;
      const board = TestRenderer.create(<Board pieces={pieces} turn="white" />);

      propsForSquare(board, 2).onClick()
      propsForSquare(board, 5).onClick()

      expect(propsForSquare(board, 2).selected).toBe(false)
    })
  })
});

function propsForSquare(boardComponent, index) {
  const boardElement = boardComponent.root.findByProps({ id: 'board' });
  const squareElement = boardElement.props.children[index];
  return squareElement.props;
}
