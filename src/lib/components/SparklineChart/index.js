/**
 * @fileoverview Element that renders data as a spark line.
 */

import {html, svg} from "lit-element";
import {BaseElement} from "../BaseElement";

const HAS_RESIZE_OBSERVER = typeof ResizeObserver === "function";

/**
 * @typedef {{
 *   x: number,
 *   y: number,
 *   score: number,
 *   date: string,
 * }}
 */
let DataPoint; // eslint-disable-line no-unused-vars

/**
 * @typedef {{
 *   points: string,
 *   lastPoint: {x: number, y: number},
 *   firstPoint: {x: number, y: number},
 *   color: string,
 * }}
 */
let PathPart; // eslint-disable-line no-unused-vars

/**
 * @param {number} val to round
 * @return {number} number rounded to two decimals
 */
function clampTo2Decimals(val) {
  return Math.round(val * 100) / 100;
}

/**
 * Render a sparkline.
 * @extends {BaseElement}
 * @final
 */
class SparklineChart extends BaseElement {
  static get properties() {
    return {
      fill: {type: Boolean},
      values: {type: Object},
      medians: {type: Object},

      // TODO: make these all --var?
      padding: {type: Number}, // configurable padding
      circleRadius: {type: Number}, // configurable circle radius
      strokeWidth: {type: Number}, // width of SVG stroke
      scoreHeight: {type: Number}, // ?????

      demo: {type: Boolean},
    };
  }

  constructor() {
    super();

    this.padding = 0;
    this.circleRadius = 3;
    this.strokeWidth = 2;
    this.scoreHeight = 0; // FIXME: was 15

    // private, updated in render() by calling getBoundingClientRect
    this.width_ = 0;
    this.height_ = 0;

    // cursor selection, causes non-render() changes
    this.point_ = null;

    // elements stolen from renderRoot
    this.cursorElement_ = null;
    this.scoreElement_ = null;
    this.announcerElement_ = null;
    this.scoreValueText_ = null;
    this.scoreDateText_ = null;

    // processed points from values that allow mouse focus
    this.datapoints = [];

    // bind so this can be added/removed from a global handler
    this.onResize = this.onResize.bind(this);
  }

  set demo(demo) {
    this.demo_ = demo;

    if (demo) {
      // FIXME FIXME FIXME remove before submit
      this.values = [
        // {score: 35, date: "2019-05-22"},
        // {score: 30, date: "2019-05-24"},
        // {score: 20, date: "2019-06-01"},
        // {score: 50, date: "2019-06-24"},
        // {score: 92, date: "2019-06-29"},
        {score: 90, date: "2019-07-01"},
      ];

      this.medians = [
        {score: 85, date: "2019-05-31"},
        {score: 89, date: "2019-06-24"},
      ];

      console.debug("demo mode activated for web-sparkline-chart", this);
    }
  }

  get demo() {
    return this.demo_;
  }

  redrawPoint() {
    if (!(this.cursorElement_ && this.scoreElement_)) {
      return;
    }

    // Clear the point if it was drawn on the screen.
    if (!this.point_) {
      this.cursorElement_.setAttribute("x1", -10000);
      this.cursorElement_.setAttribute("x2", -10000);
      this.scoreElement_.setAttribute("transform", `translate(-10000,-10000)`);
      return;
    }

    // Draw the point on the screen.
    this.cursorElement_.setAttribute("x1", this.point_.x);
    this.cursorElement_.setAttribute("x2", this.point_.x);
    this.cursorElement_.setAttribute("y1", this.point_.y);
    this.cursorElement_.setAttribute("y2", this.height_ + this.scoreHeight);
    const colorClass = this.computeColorClass_(this.point_.score);
    this.cursorElement_.style.stroke = colorClass;
    this.cursorElement_.classList.value = `sl-cursor ${colorClass}`;

    // Set text first, then measure.
    this.scoreValueText_.textContent = this.point_.score;

    const d = new Date(this.point_.date);
    let dateText = "\u2014"; // em dash

    if (d.getTime()) {
      // d.getTime() is NaN/falsey if invalid
      try {
        dateText = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
        }).format(d);
      } catch (err) {
        dateText = d.toLocaleDateString();
      }
    }
    this.scoreDateText_.textContent = dateText;

    const PADDING = 3;

    const scoreHoverRectWidth = this.scoreElement_.getBoundingClientRect()
      .width;
    const x = Math.max(
      PADDING,
      Math.min(
        this.width_ - scoreHoverRectWidth - 2 * PADDING,
        this.point_.x - scoreHoverRectWidth / 2,
      ),
    );
    const y = Math.max(
      -1 * (this.height_ / 2),
      Math.min(this.height_ / 2 - PADDING - 10, this.point_.y - 10),
    );

    // Position score/date centered on the hover card.
    const scoreTextWidth = this.scoreValueText_.getBoundingClientRect().width;
    const dateTextWidth = this.scoreDateText_.getBoundingClientRect().width;
    this.scoreDateText_.setAttribute(
      "x",
      scoreHoverRectWidth / 2 - dateTextWidth / 2,
    );
    this.scoreValueText_.setAttribute(
      "x",
      scoreHoverRectWidth / 2 - scoreTextWidth / 2,
    );
    this.scoreElement_.setAttribute("transform", `translate(${x},${y})`);
    this.scoreElement_.style.fill = colorClass;
    this.scoreElement_.classList.value = colorClass;
  }

  set point(point) {
    if (this.point_ === point) {
      return;
    }

    this.point_ = point;
    if (point) {
      const date = new Date(point.date).toLocaleDateString();
      this.announce_(`Score ${point.score} on date ${date}`);
    }
    this.redrawPoint();
  }

  get point() {
    return this.point_;
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("aria-valuemin", 0);
    this.setAttribute("aria-valuemax", 100);

    this.setAttribute("role", "group");
    this.setAttribute(
      "aria-label",
      "scores over time. Use arrow keys to navigate",
    );

    if (!HAS_RESIZE_OBSERVER) {
      window.addEventListener("resize", this.onResize);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (!HAS_RESIZE_OBSERVER) {
      window.removeEventListener("resize", this.onResize);
    }
  }

  /**
   * As a mouse moves over this element, find and highlight the nearest point in the chart.
   *
   * @param {!Event} e
   */
  onMouseMove(e) {
    // TODO(b/117590606): Make this work with touch events.
    const mouseX = e.offsetX;

    const nextDataPointIdx = this.datapoints.findIndex(
      (entry) => entry.x >= mouseX,
    );
    const prevPoint = this.datapoints[nextDataPointIdx - 1];
    const nextPoint = this.datapoints[nextDataPointIdx];

    let point;
    if (!nextPoint) {
      point = this.datapoints[this.datapoints.length - 1];
    } else if (!prevPoint) {
      point = this.datapoints[0];
    } else {
      if (Math.abs(mouseX - prevPoint.x) <= Math.abs(mouseX - nextPoint.x)) {
        point = prevPoint;
      } else {
        point = nextPoint;
      }
    }

    this.point = point;
  }

  /**
   * Allow keyboard navigation through points.
   *
   * @param {!Event} e
   */
  onKeyDown(e) {
    switch (e.key) {
      case "Right":
      case "ArrowRight":
        this.setNextPoint_();
        break;

      case "Left":
      case "ArrowLeft":
        this.setPrevPoint_();
        break;

      default:
        return;
    }

    e.preventDefault();
  }

  /**
   * Set the next point that should be drawn to the screen.
   * @private
   */
  setNextPoint_() {
    const cursorX = this.cursorElement_.getAttribute("x1");
    const nextPoint = this.datapoints.find((entry) => entry.x > cursorX);

    let point;
    if (!nextPoint) {
      point = this.datapoints[this.datapoints.length - 1];
    } else {
      point = nextPoint;
    }

    if (point) {
      this.point = point;
    }
  }

  /**
   * Set the previous point that should be drawn to the screen.
   * @private
   */
  setPrevPoint_() {
    const cursorX = this.cursorElement_.getAttribute("x1");
    const currentPointIdx = this.datapoints.findIndex(
      (entry) => entry.x == cursorX,
    );
    const prevPoint = this.datapoints[currentPointIdx - 1];

    let point;
    if (!prevPoint) {
      point = this.datapoints[0];
    } else {
      point = prevPoint;
    }

    if (point) {
      this.point = point;
    }
  }

  /**
   * Clear the point due to blur or mouseout.
   */
  onClearPoint() {
    this.point = null;
  }

  /**
   * Announce content for screen readers using an ARIA live region.
   * @private
   * @param {string} msg
   */
  announce_(msg) {
    this.announcerElement_.textContent = msg;
    window.setTimeout(() => {
      this.announcerElement_.textContent = "";
    }, 100);
  }

  /**
   * Calculate the data point y's value
   * @param {number} y
   * @return {number}
   */
  calculateY(y) {
    const min = 0;
    const max = this.height_;
    if (!max) {
      return 0; // not on page yet
    }

    const s = max !== min ? this.height_ / (max - min) : 1;
    return this.height_ - s * (y - min);
  }

  /**
   * Generates the line path from values.
   * @param {?Array<!LighthouseScore>} values Values to generate a path from.
   * @return {{datapoints: !Array<Object>, path: !Array<!PathPart>}}
   * @private
   */
  processValues(values) {
    if (!values || values.length === 0) {
      // no values, failure case: just draw in the top-left corner
      return {
        datapoints: [],
        paths: [
          {
            points: "M0 0 L0 0",
            firstPoint: {x: 0, y: 0},
            lastPoint: {x: 0, y: 0},
            color: "",
          },
        ],
      };
    }

    // Regardless of how many values we have, each is interspersed by the same offset.
    const offset =
      values.length > 1 ? Math.floor(this.width_ / (values.length - 1)) : 0;

    const datapoints = [];
    const paths = [];

    let points = `M0 ${this.calculateY(values[0].score).toFixed(2)}`;
    let firstPoint = {x: NaN, y: NaN};
    let lastPoint = {x: NaN, y: NaN};
    let prevColor;

    values.forEach((value, i) => {
      const isFirstPoint = i === 0;
      const isLastPoint = i === values.length - 1;

      // if last point, use width (otherwise the clamp hides ~fractional pixels)
      const x = isLastPoint ? this.width_ : i * offset;
      const y = parseFloat(this.calculateY(value.score).toFixed(2));
      const currColor = this.computeColorClass_(value.score);

      if (isFirstPoint) {
        firstPoint = {x, y};
      } else if (prevColor !== currColor) {
        paths.push({firstPoint, lastPoint, color: prevColor, points});
        points = `M${lastPoint.x} ${lastPoint.y} L${lastPoint.x} ${lastPoint.y}`;
        firstPoint = {x: lastPoint.x, y: lastPoint.y};
      }

      points += ` L${x} ${y}`;

      if (isLastPoint) {
        if (isFirstPoint) {
          // if this graph only has one point, the fill needs to reset to far left
          firstPoint.x = 0;
        }
        paths.push({firstPoint, lastPoint: {x, y}, color: currColor, points});
      }

      prevColor = currColor;
      lastPoint = {x, y};

      datapoints.push({
        x,
        y,
        score: clampTo2Decimals(value.score),
        date: value.date,
      });
    });

    return {paths, datapoints};
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has("fill") || changedProperties.has("values")) {
      const gradients = this.renderRoot.getElementsByClassName("gradient");
      for (const gradient of gradients) {
        if (this.fill) {
          gradient.classList.add("fadein");
        } else {
          gradient.classList.remove("fadein");
        }
      }
    }
  }

  render() {
    const rect = this.getBoundingClientRect();

    // If the element hasn't yet had layout, then request a rerender a frame later.
    if (!rect.width || !rect.height) {
      window.requestAnimationFrame(() => this.requestUpdate());
      // we can't bail early, as firstUpdated() still needs to steal rendered nodes
    }

    const pixelBuffer = this.padding + this.circleRadius + this.strokeWidth / 2;

    // Save width and height, padded by any requested buffer. This is needed for processValues()
    // and showing the user's cursor.
    // Align the SVG content by `pixelBuffer` on the top, left, and right sides.
    const groupTransform = `translate(${pixelBuffer},${pixelBuffer +
      this.scoreHeight})`;
    this.width_ = rect.width - pixelBuffer * 2;
    this.height_ = rect.height - pixelBuffer - this.scoreHeight;

    const {paths, datapoints} = this.processValues(this.values);
    this.datapoints = datapoints;

    if (this.datapoints.length) {
      this.setAttribute("aria-valuenow", this.datapoints.slice(-1)[0].score);
    } else {
      this.removeAttribute("aria-valuenow");
    }

    const lastDataPoint = paths[paths.length - 1] || null;
    const {paths: medianPaths} = this.processValues(this.medians);

    const lastDataPointCircle = lastDataPoint
      ? svg`
      <circle
        cx="${lastDataPoint.lastPoint.x}"
        cy="${lastDataPoint.lastPoint.y}"
        r="${this.circleRadius}"
        stroke-width="${this.strokeWidth}"
        class="${lastDataPoint.color}"
        style="fill:#fff" />`
      : "";

    /* eslint-disable max-len,indent */
    const innerSVG = svg`
      <svg xmlns="http://www.w3.org/2000/svg"
          width="100%" height="130%" style="padding: ${this.padding}px;">
        <defs>
          <filter id="hover-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000"
               flood-opacity="0.4"/>
          </filter>
          <linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(24,182,99)" stop-opacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-orange" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(251,140,0)" stop-opacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(229,57,53)" stop-opacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="${groupTransform}">
          ${paths.map(({firstPoint, points, color}) => {
            // Ensures that each path segment's fill is complete.
            const height = this.height_ + this.scoreHeight / 2;
            const d = `${points} V ${height} H ${firstPoint.x} Z`;
            return svg`
              <path class="gradient" stroke="none"
                  d="${d}"
                  fill="${this.fill ? `url(#gradient-${color})` : "none"}" />
              <path d="${points}" class="path ${color}" style="fill:none" />
            `;
          })}
          ${medianPaths.map(({points}) => {
            return svg`<path d="${points}" class="path dashed" />`;
          })}
          <line id="cursor" class="sl-cursor"
                x1="-10000" x2="-10000" y1="0" y2="${this.height_}" />
          ${lastDataPointCircle}
          <g id="score" transform="translate(-10000,-10000)" aria-hidden="true">
            <rect width="50" height="40" fill="#fff" rx="2" ry="2"
                  style="filter:url(#hover-shadow)"/>
            <text id="value" stroke="none" x="25" y="18"></text>
            <text id="date" stroke="none" x="3" y="32"></text>
          </g>
        </g>
      </svg>`;

    return html`
      <div
        tabindex="0"
        class="lr-sparkline-outer"
        @blur=${this.onClearPoint}
        @mouseout=${this.onClearPoint}
        @mousemove=${this.onMouseMove}
        @keydown=${this.onKeyDown}
      >
        ${innerSVG}
        <div aria-live="assertive" class="sr-announcer"></div>
      </div>
    `;
  }

  /**
   * Determines Lighthouse pass/average/fail coloring based on value.
   * @param {number} val
   * @return {string}
   * @private
   */
  computeColorClass_(val) {
    // Match to Lighthouse rating. See https://goo.gl/Pz6xfR.
    let colorClass = "red";
    if (val >= 90) {
      colorClass = "green";
    } else if (val >= 50) {
      colorClass = "orange";
    }
    return colorClass;
  }

  onResize() {
    // When the browser window resizes, force a render to redraw the SVG.
    this.requestUpdate().then(() => {
      this.redrawPoint();
    });
  }

  firstUpdated() {
    if (HAS_RESIZE_OBSERVER) {
      // Observe a DOM node we control, as the <web-sparkline-chart> itself may
      // not be `display: block`.
      const outer = this.renderRoot.querySelector(".lr-sparkline-outer");
      const ro = new ResizeObserver(this.onResize);
      ro.observe(outer);
    }

    this.cursorElement_ = this.renderRoot.querySelector("#cursor");
    this.scoreElement_ = this.renderRoot.querySelector("#score");
    this.announcerElement_ = this.querySelector(".sr-announcer");
    this.scoreValueText_ = this.scoreElement_.querySelector("text#value");
    this.scoreDateText_ = this.scoreElement_.querySelector("text#date");
  }
}

customElements.define("web-sparkline-chart", SparklineChart);
