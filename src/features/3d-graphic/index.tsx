import Plot from "react-plotly.js";
import { ParameterInput } from "../../shared/components/parameter-input";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { IntegrationMethod } from "@/shared/types";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useGraphicValues } from "./model/use-graphic-values";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";

export const VanDerPol3DPlot = () => {
  const {
    values,
    plotData,
    trajectories,
    method,
    color,
    lineWidth,
    resetKey,
    integrationTime,
    // isPending,
    handleSetIntegrationTime,
    handleChangeDt,
    setColor,
    setMethod,
    setLineWidth,
    onChange,
    resetValues,
    addTrajectory,
    removeAllTrajectories,
    removeLastTrajectory,
    removeTrajectory,
  } = useGraphicValues();

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="text-xl font-semibold text-center">
        Фазовый портрет системы типа Ван дер Поля с автоматической регулировкой
        частоты
      </h1>
      <div className="p-4">
        <BlockMath>
          {String.raw`
          \begin{cases}
          \dot{x} = y, \\
          \dot{y} = -(1 + z^2)x + \varepsilon(\alpha - x^2)y, \\
          \dot{z} = \varepsilon(x^2 - \beta y^2).
          \end{cases}
        `}
        </BlockMath>
      </div>
      <div className="flex flex-col md:flex-row items-start justify-center w-full h-full">
        <div className="w-full max-w-[700px] flex flex-col gap-2 p-4">
          <div className="flex flex-col gap-2">
            <Select
              value={method}
              onValueChange={(value) => setMethod(value as IntegrationMethod)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Методы счета" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="euler">Метод Эйлера</SelectItem>
                <SelectItem value="rk4">Рунге-Кутта 4-го порядка</SelectItem>
                <SelectItem value="adams">Метод Адамса</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Checkbox
                id="backward"
                checked={values.dt < 0}
                onCheckedChange={(checked) =>
                  onChange("dt", Math.abs(values.dt) * (checked ? -1 : 1))
                }
              />
              <label
                htmlFor="backward"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Обратный шаг
              </label>
            </div>
          </div>

          {Object.entries(values).map(([key, value]) => {
            if (key !== "x0" && key !== "y0" && key !== "z0" && key !== "dt") {
              return (
                <div
                  key={key}
                  className="grid grid-cols-[12.5rem_minmax(auto,max-content)_2.25rem] gap-2 items-center"
                >
                  <label htmlFor={key} className="select-none">
                    {`Параметр ${key}`}:
                  </label>
                  <ParameterInput
                    label={key}
                    value={value}
                    resetKey={resetKey}
                    onChange={(v) => onChange(key, v)}
                    backup={true}
                    isValidText={true}
                    addTrajectory={addTrajectory}
                  />
                </div>
              );
            }
          })}

          <div className="grid grid-cols-[12.5rem_minmax(auto,max-content)] gap-2 items-start">
            <label
              htmlFor="integr-time"
              className="max-w-[12.5rem] text-wrap break-words select-none"
            >
              Шаг интегрирования:
            </label>
            <ParameterInput
              label={"integr-step"}
              value={values.dt}
              resetKey={resetKey}
              onChange={handleChangeDt}
              backup={true}
              isValidText={true}
              addTrajectory={addTrajectory}
            />
          </div>
          <div className="grid grid-cols-[12.5rem_minmax(auto,max-content)] gap-2 items-start">
            <label
              htmlFor="integr-time"
              className="max-w-[12.5rem] text-wrap break-words select-none"
            >
              Время интегрирования:
            </label>
            <ParameterInput
              label={"integr-time"}
              value={integrationTime}
              resetKey={resetKey}
              onChange={(value) => handleSetIntegrationTime(value)}
              addTrajectory={addTrajectory}
              className="max-w-[5rem]"
            />
          </div>

          <div className="grid grid-cols-[12.5rem_minmax(auto,max-content)] gap-2 items-start">
            <label
              htmlFor="x0"
              className="max-w-[12.5rem] text-wrap break-words select-none"
            >
              Начальные значения
            </label>

            <div className="flex items-center gap-1">
              <span>(</span>
              {Object.entries({
                x0: values.x0,
                y0: values.y0,
                z0: values.z0,
              }).map(([key, value], index, array) => (
                <div key={key} className="flex items-center gap-1">
                  <ParameterInput
                    label={key}
                    value={value}
                    resetKey={resetKey}
                    onChange={(v) => onChange(key, v)}
                    addTrajectory={addTrajectory}
                    className="max-w-[5rem]"
                  />
                  {index < array.length - 1 && <span>,</span>}
                </div>
              ))}
              <span>)</span>
            </div>
          </div>

          <div className="grid grid-cols-[12.5rem_minmax(auto,max-content)] items-start gap-2">
            <label htmlFor="traj-params">Параметры траектории:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="traj-params" className="cursor-pointer">
                  Выбрать
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-full p-0 bg-background/50 backdrop-blur-md shadow-[inset_0_0_0_2px_rgba(255,255,255,0.6)] rounded-xl"
              >
                <div className="w-full flex flex-col">
                  <div className="grid grid-cols-2 items-start gap-2 p-2">
                    <label htmlFor="line-width" className="font-medium text-md">
                      Толщина линии:
                    </label>
                    <Input
                      id="line-width"
                      type="number"
                      min={0}
                      max={10}
                      value={lineWidth}
                      onChange={(e) => setLineWidth(e.target.value)}
                      className="max-w-[5rem] bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-start gap-2 p-2">
                    <label htmlFor="color" className="font-medium text-md">
                      Цвет линии:
                    </label>
                    <HexColorPicker
                      id="color"
                      className="w-full"
                      color={color}
                      onChange={setColor}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetValues}
            className="max-w-fit bg-gray-500 text-background hover:bg-gray-500/80 hover:text-background"
          >
            Сбросить значения
          </Button>

          {/* Поля для начальных условий */}
          <div className="flex gap-2 items-center mt-4">
            <Button onClick={addTrajectory} className="w-fit">
              Добавить траекторию
            </Button>
            {trajectories.length >= 2 && (
              <Button onClick={removeLastTrajectory} className="max-w-fit">
                Убрать последнюю
              </Button>
            )}
          </div>

          {/* Список траекторий с возможностью удаления */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={removeAllTrajectories}
              className="max-w-fit bg-gray-500 text-background hover:bg-gray-500/80 hover:text-background"
            >
              Очистить траектории
            </Button>
            <h3 className="font-medium">Траектории:</h3>
            <div className="w-fit pr-4 max-h-60 overflow-y-auto">
              {trajectories.map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-1"
                >
                  <span>Траектория {index}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTrajectory(index)}
                    className="hover:cursor-pointer hover:opacity-90"
                  >
                    Удалить
                  </Button>
                </div>
              ))}
              {!trajectories.length && "Нет траекторий"}
            </div>
          </div>
        </div>

        <div className="relative flex items-start justify-center w-full h-full max-w-[700px] min-h-[600px]">
          {/* {isPending ? (
            <FullContainerLoader />
          ) : ( */}
          <Plot
            className="w-full h-full max-h-[600px]"
            data={plotData}
            layout={{
              title: "Предельный цикл",
              autosize: true,
              showlegend: false,
              scene: {
                xaxis: { title: "x" },
                yaxis: { title: "y" },
                zaxis: { title: "z", range: [-1, 1] },
              },
            }}
            config={{
              displaylogo: false,
            }}
            useResizeHandler={true}
          />
          {/* )} */}
        </div>
      </div>
    </div>
  );
};
