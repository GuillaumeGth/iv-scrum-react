import './style.scss';
type Props = {
    value: number    
}
const CircleProgressBar : React.FC<Props> = ({value}) => {
    return (
        <div className="set-size charts-container">
            <div className={`pie-wrapper progress-${value} style-2`}>
                <span className="label">{value}<span className="smaller">%</span></span>
                <div className="pie">
                    <div className="left-side half-circle"></div>
                    <div className="right-side half-circle"></div>
                </div>
                <div className="shadow"></div>
            </div>
        </div>
    )
}
export default CircleProgressBar