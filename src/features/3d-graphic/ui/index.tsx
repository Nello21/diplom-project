import Plot from "react-plotly.js";
import { ParameterInput } from "../../../shared/components/parameter-input";
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
import { GraphicParameters, IntegrationMethod } from "@/shared/types";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import { useGraphicValues } from "../model/use-graphic-values";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "@/shared/consts/routes";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useState } from "react";
import { ResetDialog } from "@/shared/components/reset-dialog";

type SystemParamKeys = keyof Pick<GraphicParameters, "ε" | "α" | "β">;

type NumericSettingKeys = keyof Pick<GraphicParameters, "dt" | "intTime">;

type InitialConditionKeys = keyof Pick<GraphicParameters, "x0" | "y0" | "z0">;

export const VanDerPol3DPlot = () => {
  const {
    values,
    plotData,
    trajectories,
    method,
    color,
    lineWidth,
    resetKey,
    setColor,
    setMethod,
    setLineWidth,
    onChange,
    resetValues,
    resetInitParams,
    addTrajectory,
    removeAllTrajectories,
    removeLastTrajectory,
    removeTrajectory,
  } = useGraphicValues();

  const [isSystemParamsChanged, setIsSystemParamsChanged] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const systemParamKeys: SystemParamKeys[] = ["ε", "α", "β"];
  const numericSettingKeys: NumericSettingKeys[] = ["dt", "intTime"];
  const initialConditionKeys: InitialConditionKeys[] = ["x0", "y0", "z0"];

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full flex justify-between gap-2 mb-4">
        <Button
          size="sm"
          disabled={location.pathname === ROUTES.vanderpol}
          onClick={() => navigate(ROUTES.vanderpol)}
        >
          <span className="hidden lg:inline">Исходная система</span>
          <ArrowLeft className="lg:hidden w-4 h-4" />
        </Button>

        <h1 className="px-2 text-sm sm:text-xl font-semibold text-center">
          Фазовый портрет системы Ван дер поля с автоматической регулировкой
          частоты
        </h1>

        <Button
          size="sm"
          disabled={location.pathname === ROUTES.averagedSystem}
          onClick={() => navigate(ROUTES.averagedSystem)}
        >
          <span className="hidden lg:inline">Усредненная система</span>
          <ArrowRight className="lg:hidden w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        <BlockMath>
          {String.raw`\begin{cases}
            \dot{x} = y, \\
            \dot{y} = -(1 + z^2)x + \varepsilon(\alpha - x^2)y, \\
            \dot{z} = \varepsilon(x^2 - \beta y^2).
          \end{cases}`}
        </BlockMath>
      </div>

      {/* График */}
      <div className="relative flex items-start justify-center w-full min-w-[500px] h-[65dvh] sm:h-[90dvh]">
        <Plot
          className="w-full h-full"
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
            responsive: true,
            displaylogo: false,
          }}
          useResizeHandler={true}
        />
      </div>

      <div className="w-full flex flex-col items-start gap-2">
        <Button onClick={addTrajectory} className="w-fit">
          Добавить траекторию
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit">
              Управление траекториями
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-3">
              {trajectories.length >= 2 && (
                <Button
                  onClick={removeLastTrajectory}
                  variant="secondary"
                  className="w-full"
                >
                  Убрать последнюю
                </Button>
              )}

              <Button
                variant="destructive"
                size="sm"
                onClick={removeAllTrajectories}
                disabled={trajectories.length === 0}
                className="w-full"
              >
                Очистить все траектории
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={resetValues}
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Сбросить все значения
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-start justify-between w-full h-full">
        <div className="w-full flex flex-col lg:flex-row gap-4 p-4 max-w-[100%] overflow-x-auto">
          {/* Группа: Настройки счёта */}
          <Card className="min-w-[300px] lg:flex-1">
            <CardHeader>
              <CardTitle className="text-gray-500 font-medium">
                Настройки счёта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-gray-600 text-sm mb-1 block">
                    Метод интегрирования
                  </label>
                  <Select
                    value={method}
                    onValueChange={(value) =>
                      setMethod(value as IntegrationMethod)
                    }
                  >
                    <SelectTrigger className="max-w-[15rem]">
                      <SelectValue placeholder="Выберите метод" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="euler">Метод Эйлера</SelectItem>
                      <SelectItem value="rk4">
                        Рунге-Кутта 4-го порядка
                      </SelectItem>
                      <SelectItem value="adams">Метод Адамса</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">
                  <Checkbox
                    id="backward"
                    checked={values.dt < 0}
                    onCheckedChange={(checked) =>
                      onChange("dt", Math.abs(values.dt) * (checked ? -1 : 1))
                    }
                  />
                  <label htmlFor="backward" className="text-gray-600 text-sm">
                    В обратном времени
                  </label>
                </div>

                {numericSettingKeys.map((key) => (
                  <div key={key} className="flex flex-col items-start gap-2">
                    <label htmlFor={key} className="text-gray-600 text-sm">
                      {key === "dt"
                        ? "Шаг интегрирования"
                        : "Время интегрирования"}
                    </label>
                    <ParameterInput
                      value={values[key]}
                      resetKey={resetKey}
                      onChange={(v) => onChange(key, v)}
                      backup={true}
                      isValidText={true}
                      addTrajectory={addTrajectory}
                      className="min-w-[5rem]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Группа: Параметры системы */}
          <Card className="min-w-[300px] lg:flex-1">
            <CardHeader>
              <CardTitle className="text-gray-500 font-medium">
                Параметры системы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {systemParamKeys.map((key) => (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="text-gray-600 text-sm mb-1">
                      {key === "ε"
                        ? "ε (epsilon)"
                        : key === "α"
                        ? "α (alpha)"
                        : "β (beta)"}
                    </label>
                    <ParameterInput
                      id={key}
                      value={values[key]}
                      resetKey={resetKey}
                      onChange={(v) => (
                        onChange(key, v), setIsSystemParamsChanged(true)
                      )}
                      onBlur={() => {
                        if (isSystemParamsChanged) setIsOpen(true);
                      }}
                      backup={true}
                      isValidText={true}
                      addTrajectory={() => {
                        if (isSystemParamsChanged) {
                          setIsOpen(true);
                        } else addTrajectory();
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Группа: Начальные условия */}
          <Card className="min-w-[300px] sm:min-w-[350px] lg:flex-1">
            <CardHeader>
              <CardTitle className="text-gray-500 font-medium">
                Начальные условия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-start justify-between">
                <label className="text-gray-600 text-sm mb-1">
                  Начальная точка (x₀, y₀, z₀)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="text-gray-400">(</span>
                  {initialConditionKeys.map((key, index, arr) => (
                    <div key={key} className="flex items-center gap-1">
                      <ParameterInput
                        id={key}
                        value={values[key]}
                        resetKey={resetKey}
                        onChange={(v) => onChange(key, v)}
                        addTrajectory={addTrajectory}
                        className="w-20"
                      />
                      {index < arr.length - 1 && (
                        <span className="text-gray-400">,</span>
                      )}
                    </div>
                  ))}
                  <span className="text-gray-400">)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Группа: Настройки графики */}
          <Card className="min-w-[300px] lg:flex-1">
            <CardHeader>
              <CardTitle className="text-gray-500 font-medium">
                Настройки графики
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm mb-1">
                    Толщина линии
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={lineWidth}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") return addTrajectory();
                    }}
                    onChange={(e) => setLineWidth(e.target.value)}
                    className="w-24 bg-white"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-600 text-sm mb-1">
                    Цвет линии
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{color}</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <HexColorPicker color={color} onChange={setColor} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Группа: Управление траекториями */}
          <Card className="min-w-[300px] lg:flex-1">
            <CardHeader>
              <CardTitle className="text-gray-500 font-medium">
                Список траекторий
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="max-h-60 overflow-y-auto pr-2">
                  {trajectories.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Нет добавленных траекторий
                    </p>
                  ) : (
                    trajectories.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-700">
                          Траектория #{index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTrajectory(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ResetDialog
        isOpen={isOpen}
        onClose={() => (setIsOpen(false), setIsSystemParamsChanged(false))}
        onSubmit={() => {
          removeAllTrajectories(), resetInitParams();
        }}
      />
    </div>
  );
};
