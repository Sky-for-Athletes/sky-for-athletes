import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import * as weatherService from "../../services/weather.service";
import { useWeather } from "../useWeather";

vi.mock("../../services/weather.service");

const mockEvaluation: weatherService.WeatherEvaluation = {
  activity: "running",
  temperature: 25,
  humidity: 60,
  windSpeed: 10,
  heatIndex: 30,
  windChill: 25,
  comfortScore: 80,
  verdict: "GOOD",
};

describe("useWeather", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("populates data on a successful evaluate call", async () => {
    vi.mocked(weatherService.evaluate).mockResolvedValue(mockEvaluation);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.evaluate(-3.7, -38.5, "running");
    });

    expect(result.current.data).toEqual(mockEvaluation);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("sets an error message and clears data on failure", async () => {
    vi.mocked(weatherService.evaluate).mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.evaluate(-3.7, -38.5, "running");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("network down");
  });

  it("reset() clears data, routeData and error", async () => {
    vi.mocked(weatherService.evaluate).mockResolvedValue(mockEvaluation);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.evaluate(-3.7, -38.5, "running");
    });
    expect(result.current.data).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.routeData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets loading to true while the request is in flight", async () => {
    let resolve!: (v: weatherService.WeatherEvaluation) => void;
    vi.mocked(weatherService.evaluate).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      })
    );
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.evaluate(-3.7, -38.5, "running");
    });
    await waitFor(() => expect(result.current.loading).toBe(true));

    await act(async () => {
      resolve(mockEvaluation);
    });
    expect(result.current.loading).toBe(false);
  });
});
