package com.web.backend_byspring.utils;

import lombok.extern.slf4j.Slf4j;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Slf4j
public class DateTimeUtils {

    private DateTimeUtils() {
    }

    public static Date convertStringToDate(String dateOfBirth) {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return dateFormat.parse(dateOfBirth);
        } catch (Exception e) {
            log.error("Error parsing date", e);
        }
        return new Date();
    }

    public static LocalTime convertStringTimeToLocalTime(String strTime) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        return LocalTime.parse(strTime, dateTimeFormatter);
    }
}
