import React, { Fragment, useState } from 'react';
import { JDtypho, JDalign, JDbutton, IJDalignProp, selectOpCreater, JDselect, JDlabel } from '@janda-com/front';
import { IResvContext, IRoomSelectInfo } from '../../pages/declare';
import { getHouseForPublic_GetHouseForPublic_house_roomTypes } from '../../types/api';
import { LANG } from '../../App';
import { IRoomTypeContext, Gender } from './RoomTypeWrap';
import { getAvailableCountFromQuery } from './helper';
import { queryDataFormater } from '@janda-com/front';
import { IJDtyphoProp } from '@janda-com/front/build/components/typho/Typho';

interface CounterProp {
	count: number;
	handleCount: (flag: boolean, target: any) => any;
	target?: any;
	label: string;
	labelProp?: IJDtyphoProp;
	maxCount: number;
	isLastRoomType?: boolean;
}

export const Counter: React.FC<CounterProp> = ({ handleCount, labelProp, target, count, label, maxCount,isLastRoomType }) => {
	return (
		<JDalign
			className="counter"
			flex={{
				vCenter: true
			}}
		>
			<JDtypho weight={600} mr="large" {...labelProp}>
				{label}
			</JDtypho>
			<JDalign className="counter__inner">
				<JDbutton
					disabled={count === 0}
					thema="grey1"
					mode="flat"
					className="counter__btn"
					onClick={() => {
						handleCount(false, target);
					}}
				>
					-
				</JDbutton>
				<JDbutton thema="grey1" mode="flat" className="counter__count">
					{count}
				</JDbutton>
				<JDbutton
					disabled={maxCount <= count}
					thema="grey1"
					mode="flat"
					className="counter__btn"
					onClick={() => {
						handleCount(true, target);
					}}
				>
					+
				</JDbutton>
			</JDalign>
		</JDalign>
	);
};

interface IProps {
	resvContext: IResvContext;
	roomType: getHouseForPublic_GetHouseForPublic_house_roomTypes;
	fullDatePrice: number;
	targetSelectInfo: IRoomSelectInfo;
	isDomitory: boolean;
	roomTypeContext: IRoomTypeContext;
	availableCount: {
		maleCount: number;
		femaleCount: number;
		roomCount: number;
	};
	alignProp?: IJDalignProp;
	menuPositon?: string;
}

const CountSelecter: React.FC<IProps> = ({
	resvContext,
	targetSelectInfo,
	fullDatePrice,
	isDomitory,
	roomTypeContext,
	availableCount,
	alignProp,
	menuPositon
}) => {
	const [ loading, setLoading ] = useState(false);
	const { refetchCapacity, capacityData, sharedQueryVariable } = roomTypeContext;
	const {
		femaleCount: availableCountFemale,
		maleCount: availableCountMale,
		roomCount: availableCountRoom
	} = availableCount;
	const { roomSelectInfo, setRoomSelectInfo } = resvContext;
	// const [ maxCount, setMaxCount ] = useState({
	// 	maxFemale: availableCountFemale,
	// 	maxMale: availableCountMale
	// });


	const handleCount = async ( target: 'male' | 'female' | 'room', count:number) => {
		if (loading) return;
		setLoading(true);
		if (!targetSelectInfo) throw Error('This must not happend by UI :: RoomType');

		// const isFemaleCall = target === 'female';
		// const { roomCount, female, male } = targetSelectInfo.count;

		if (target === 'room') targetSelectInfo.count.roomCount = count;

		if (target !== 'room') {
			// sharedQueryVariable.RoomTypeCapacityInput.initValue = {
			// 	count,
			// 	gender: isFemaleCall ? Gender.FEMALE : Gender.MALE
			// };
			// const { data } = await refetchCapacity({
			// 	...sharedQueryVariable
			// });

			// const queryData = queryDataFormater(data, 'GetRoomTypeById', 'roomType', undefined) || undefined;

			// if (!queryData) return;

			if (target === 'female') targetSelectInfo.count.female = count || 0;
			if (target === 'male') targetSelectInfo.count.male = count || 0;

			// const capcityData = getAvailableCountFromQuery(queryData);
			// const { femaleCount, maleCount } = capcityData;

			// if (isFemaleCall && targetSelectInfo.count.male > maleCount) {
			// 	targetSelectInfo.count.male = 0;
			// }

			// if (!isFemaleCall && targetSelectInfo.count.female > femaleCount) {
			// 	targetSelectInfo.count.female = 0;
			// }

			if (targetSelectInfo.count.female < 0) {
				targetSelectInfo.count.female = 0;
			}

			if (targetSelectInfo.count.male < 0) {
				targetSelectInfo.count.male = 0;
			}

			// setMaxCount({
			// 	maxFemale: isFemaleCall ? maxCount.maxFemale : femaleCount,
			// 	maxMale: isFemaleCall ? maleCount : maxCount.maxMale
			// });
		}

		targetSelectInfo.price =
			fullDatePrice * (targetSelectInfo.count.male + targetSelectInfo.count.female + targetSelectInfo.count.roomCount);


		setRoomSelectInfo([ ...roomSelectInfo ]);

		setLoading(false);
	};


	const { count } = targetSelectInfo;
	const { male, female, roomCount } = count;

	const maleOp = selectOpCreater({count: availableCountMale ? availableCountMale + 1 : availableCountMale , labelAdd:"명",start:0 })
	const selectedMaleOp = maleOp.find(op => op.value === male) || maleOp[0];
	return (
		<JDalign
			flex={{
				around: true,
				grow: true
			}}
			className="countSelecter"
			{...alignProp}
		>
			{isDomitory ? (
				<Fragment>
					<JDalign z={3} flex={{
						between:true,
						vCenter:true
					}}>
					<JDalign flex={{
						vCenter:true
					}}>
						<JDlabel mb="no" mr="small" txt="인원"/>
						<JDselect mb="no" menuPlacement={menuPositon} autoSize z={3}  onChange={(selected)=>{
							handleCount("male",selected.value);
						}}  selectedOption={selectedMaleOp} options={maleOp}/>
					</JDalign>
{/* 
					<JDselect
					 onChange={(selected)=>{
						handleCount("female",selected.value);
					}}
					label={LANG('female')} selectedOption={selectedFemaleOp} options={femaleOp}/>
					<JDpreloader loading={loading}/> */}
					<span/>
					</JDalign>

				</Fragment>
			) : (
				<Counter
					maxCount={availableCountRoom}
					label={LANG('room_count')}
					handleCount={()=> {handleCount("room",roomCount)}}
					target={'room'}
					count={roomCount}
				/>
			)}
		</JDalign>
	);
};

export default CountSelecter;







