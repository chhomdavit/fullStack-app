package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.FileRespones;
import com.web.backend_byspring.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${project.upload}")
    private String path;

    @Value("${base.url}")
    private String baseUrl;

    @Override
    public byte[] getFileName(String fileName) {
        try {
            Path filename = Paths.get("upload", fileName);
            return Files.readAllBytes(filename);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<FileRespones> findAll() {
        List<FileRespones> fileDtoList = new ArrayList<>();
        Path directoryPath = Paths.get(path);
        try (Stream<Path> paths = Files.list(directoryPath)) {
            List<Path> pathList = paths.toList();

            for (Path p : pathList) {
                Resource resource = new UrlResource(p.toUri());

                fileDtoList.add(FileRespones.builder()
                        .name(resource.getFilename())
                        .uri(baseUrl + "/api/v1/upload/" + resource.getFilename())
                        .downloadUri(baseUrl + "/api/v1/upload/" + resource.getFilename())
                        .extension(this.getExtension(resource.getFilename()))
                        .size(resource.contentLength())
                        .build());
            }

            return fileDtoList;

        } catch (IOException e) {

            throw new RuntimeException("Failed to retrieve files", e);
        }
    }

    @Override
    public String saveBase64Image(String path, byte[] base64Image) {
        return "";
    }

    @Override
    public FileRespones uploadSingle(MultipartFile file, String path) {
        try {
            return this.save(file, path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
        }
    }

    @Override
    public List<FileRespones> uploadMultiple(List<MultipartFile> files, String path) {
        return files.stream().map(file -> {
            try {
                return save(file, path);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
            }
        }).collect(Collectors.toList());
    }

    private FileRespones save(MultipartFile file, String path) throws IOException {
        String extension = getExtension(file.getOriginalFilename());
        String name = UUID.randomUUID() + "." + extension;
        String uri = baseUrl + "/api/v1/upload/" + name;
        Long size = file.getSize();

        Path filePath = Paths.get(path, name);

        try {
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new IOException("Could not save file: " + file.getOriginalFilename(), e);
        }

        return FileRespones.builder().name(name).uri(uri).downloadUri(filePath.toString()).extension(extension)
                .size(size).build();
    }

    private String getExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        return lastDotIndex != -1 ? fileName.substring(lastDotIndex + 1) : "";
    }

    @Override
    public void deleteAll() {

    }

    @Override
    public void deleteByName(String fileName) {

    }

    @Override
    public Resource downloadByName(String fileName) {
        return null;
    }
}
