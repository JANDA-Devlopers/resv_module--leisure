import React, { Fragment } from "react";
import moment from "moment";
import { IUseDayPicker, JDicon, JDtypho, JDbutton } from "@janda-com/front";
import { JDalign } from "@janda-com/front";
import { LANG } from "../App";
import { IResvContext } from "../pages/declare";

interface Iprops {
  dayPickerHook: IUseDayPicker;
  handleDateClick: any;
}

const DateSelecter: React.FC<Iprops> = ({
  dayPickerHook,
  handleDateClick,
  ...props
}) => {
  const dateRender = (date: Date = new Date()) => {
    return (
      <JDalign
        flex={{
          vCenter: true,
        }}
        mr="normal"
      >
        <JDicon size="large" mr="normal" icon="reservation" />
        {moment(date).format("YYYY-MM-DD")}
      </JDalign>
    );
  };

  const { from, to } = dayPickerHook;
  const dateDiff = Math.abs(
    moment(from || undefined).diff(to || undefined, "d")
  );

  return (
    <JDtypho weight={600} className="dateSelecter">
      <div className="dateSelecter__inner">
        <JDalign
          flex={{
            vCenter: true,
            between: true,
          }}
        >
          <JDalign
            flex={{
              vCenter: true,
              between:true
            }}
            style={{
              width: "100%"
            }}
            onClick={handleDateClick}
            {...props}
          >
            {dateRender(from || undefined)}
            <JDbutton  mb="no" mode="border" onClick={handleDateClick}>날짜변경</JDbutton>
          </JDalign>
        </JDalign>
      </div>
    </JDtypho>
  );
};

export default DateSelecter;
