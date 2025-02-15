import { HpContext, months } from "./hp-helper";
import { useState, useEffect, useRef, useContext } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import HpCalendarEvent from "./hp-calender-event";
import HpCalendarDateCell from "./hp-calendar-datecell";
import PlEventCard from "../../ui/pl-event-card";

function HpCalendar(props) {
    const monthWiseEvents = props.monthWiseEvents ?? [];
    const filterdListCount = props.filterdListCount ?? 0
    const eventItems = props.eventItems ?? []
    const monthNames = [...months];
    const [monthIndex, setMonthIndex] = useState(0);
    const calenderRef = useRef<any>()
    const [calendarheight, setCalendarHeight] = useState(0);
    const [isEventCardActive, setEventCardStatus] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({})
    const { state } = useContext(HpContext)
    const {filters} = state;
    const currentYear = filters.year;

    const onMonthNavigate = (type) => {
        const calendarElement: any = calenderRef?.current
        const ca = calendarElement.getApi()
        if (type === 'prev') {
            if (monthIndex - 1 > -1) {
                ca.prev()
                setMonthIndex(v => v - 1)
            }
        } else {
            if (monthIndex + 1 < monthNames.length) {
                ca.next()
                setMonthIndex(v => v + 1)
            }
        }
    }

    const onEventClicked = (v) => {
        if(v) {
            setEventCardStatus(true);
            setSelectedEvent(v?.event?.extendedProps)
        }
    }

    const onCloseCard = () => {
        setEventCardStatus(false);
        setSelectedEvent({})
    }

    useEffect(() => {
        const currenMonthId = new Date().getMonth();
        const filteredMonthData = monthWiseEvents.filter(m => m.index >= currenMonthId);
        if (filteredMonthData.length > 0) {
            const selectedMonthData = filteredMonthData[0];
            setMonthIndex(selectedMonthData.index)
            const calendarElement: any = calenderRef?.current
            const ca = calendarElement.getApi()
            ca.gotoDate(`${filters.year}-${selectedMonthData.index + 1 <= 9 ? `0${selectedMonthData.index + 1}` : selectedMonthData.index + 1}-01`)
        } else if (monthWiseEvents.length > 0) {
            const selectedMonthData = monthWiseEvents[0];
            setMonthIndex(selectedMonthData.index)
            const calendarElement: any = calenderRef?.current
            const ca = calendarElement.getApi()
            ca.gotoDate(`${filters.year}-${selectedMonthData.index + 1 <= 9 ? `0${selectedMonthData.index + 1}` : selectedMonthData.index + 1}-01`)
        } else {
            setMonthIndex(currenMonthId);
            const calendarElement: any = calenderRef?.current
            const ca = calendarElement.getApi()
            ca.gotoDate(`${filters.year}-${currenMonthId + 1 <= 9 ? `0${currenMonthId+ 1}` : currenMonthId + 1}-01`)
        }
    }, [filterdListCount, currentYear])

    useEffect(() => {
        function changeCalendarHeight() {
            const calendarContainer = document.getElementById("calendar-cn")
            setCalendarHeight(calendarContainer.clientHeight)
        }
        changeCalendarHeight()
        window.addEventListener("resize", changeCalendarHeight)

        return function () {
            window.removeEventListener("resize", changeCalendarHeight)
        }

    }, [])


    return <>
        <div className="hpc">
            <div className="hpc__head">
                <div className="hpc__head__menu"></div>
                <div className="hpc__head__months">
                    {monthIndex === 0 && <img className="hpc__head__months__leftimg disabled" src="/icons/pln-icon-left-disabled.svg" />}
                    {monthIndex !== 0 && <img onClick={() => onMonthNavigate('prev')} className="hpc__head__months__leftimg" src="/icons/pln-icon-left-blue.svg" />}
                    <p className="hpc__head__months__text">{monthNames[monthIndex]}</p>
                    {monthIndex !== 11 && <img onClick={() => onMonthNavigate('next')} className="hpc__head__months__rightimg" src="/icons/pln-icon-right-blue.svg" />}
                    {monthIndex === 11 && <img className="hpc__head__months__rightimg disabled" src="/icons/pln-icon-right-disabled.svg" />}
                </div>
                <div className="hpc__head__info">
                    <div className="hpc__head__info__item">
                        <img className="hpc__head__info__item__img" src="/icons/pln-calendar-social.svg" />
                        <p className="hpc__head__info__item__text social">Social</p>
                    </div>
                    <div className="hpc__head__info__item">
                        <img className="hpc__head__info__item__img" src="/icons/pln-calendar-virtual.svg" />
                        <p className="hpc__head__info__item__text virtual">Virtual</p>
                    </div>
                    <div className="hpc__head__info__item">
                        <img className="hpc__head__info__item__img" src="/icons/pln-calendar-conference.svg" />
                        <p className="hpc__head__info__item__text conference">Conference</p>
                    </div>
                </div>
            </div>
            <div className="hpc__day">
            </div>
            <div id="calendar-cn" className="hpc__calendar">
                <FullCalendar eventClick={(v) => onEventClicked(v)} height={calendarheight} nextDayThreshold='00:00' ref={calenderRef} dayCellContent={(info) => HpCalendarDateCell(info)} visibleRange={{ start: '2023-01-01', end: '2023-12-01' }} plugins={[dayGridPlugin]} initialView='dayGridMonth' headerToolbar={{ center: '', end: '', left: '', right: '', start: '' }} events={eventItems} dayHeaders={false} showNonCurrentDates={true} eventContent={HpCalendarEvent} />
            </div>
        </div>

        {isEventCardActive && <div className="eventCard">
            <div className="eventCard__item">
                <PlEventCard {...selectedEvent}/>
                <p onClick={onCloseCard} className="eventCard__item__close">
                    <img src="/icons/pln-close-white.svg" className="eventCard__item__close__img"/>
                </p>
                
            </div>
            </div>}
        <style jsx>
            {
                `
                
            .hpc {width: 100%; overflow-y: hidden;}
            .hpc__head {display: flex; height: 70px; position: relative; padding-top: 8px; border-bottom: 1px solid #CBD5E1; width: 100%; align-items: flex-start; justify-content: center;}
            .hpc__head__months { display: flex; align-items: center; justify-content: space-between; padding:4px 8px; width: 319px; border: 1px solid #CBD5E1; background: white; border-radius: 6px;}
            .hpc__head__months__text {flex: 1; font-weight: 500; display: flex; font-size: 14px; justify-content: center;}
            .hpc__head__months__leftimg {cursor: pointer; width: 24px; height: 24px;}
            .hpc__head__months__rightimg {cursor: pointer; width: 24px; height: 24px;}
            .hpc__head__info {display: flex; gap: 0 16px; margin-right: 24px; position: absolute; top: 47px; left:auto; right: auto;}
            .hpc__head__info__item {display: flex; gap: 0 8px; align-items: center;}
            .hpc__head__info__item__img {width: 16px; height: 16px;}
            .hpc__head__info__item__text {font-size: 12px;}
            
            .hpc__calendar {height: calc(100svh - 156px); margin-top: -25px;}
            
            .eventCard {display: flex; position: fixed; top:0; left:0; right:0; width: 100vw; align-items: center; justify-content: center; height: 100vh; background: rgb(0,0,0,0.8); z-index: 15;}
            .eventCard__item {width: 90vw; position: relative;}
            .eventCard__item__close {position: absolute; top:-13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; right: -10px; width: 26px; height: 26px; background: #475569; border: 1px solid rgba(255, 255, 255, 0.5); cursor: pointer;}
            .eventCard__item__close__img {width:16px; height: 16px; }
            .social {color: #817cd2;}
            .virtual {color:#67aed7; }
            .conference {color: #63a93e;}
            .disabled {cursor: default;}
            @media(min-width: 1200px) {
                .hpc__calendar { height: calc(100svh - 86px);}
                .hpc__head { padding: 8px 0; align-items: center; height: fit-content;}
                .hpc__head__info {top: 18px; right:0;}
                .eventCard__item {width: 360px; position: relative;}
            }
            `
            }
        </style>
    </>
}


export default HpCalendar;